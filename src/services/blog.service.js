const models = require("../models");
const sequelize = require('sequelize');
const AppResponse = require("../classes/appResponse");
const utilitiesService = require("./utilities.service");
const Op = sequelize.Op;

const { v4: uuidv4 } = require('uuid');
const path           = require('path');

class BlogService{
    async getBlog(req) {
        try {
            let { id: idBlog } = req.params;
            let blog = await models.blog.Blog.findAll({ 
                where: { idBlog },
                include: [
                    {
                        model: models.blog.Usuario,
                        as:'UsuarioCreacion',
                        attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                    },
                    {
                        model: models.blog.Usuario,
                        as:'UsuarioModificacion',
                        attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                    },
                    {
                        model: models.blog.BlogComentario,
                        as:'Comentarios',
                        attributes:[ 'idComentario','comentario' ],
                        include:[
                            {
                                model: models.blog.Usuario,
                                as:'UsuarioCreacion',
                                attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                            },
                            {
                                model: models.blog.Usuario,
                                as:'UsuarioModificacion',
                                attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                            },
                        ]
                    }
                ]
            });

            return blog
                ? new AppResponse( 200, blog ) 
                : new AppResponse( 404, null , "No se encontro informacion de blog");
        } catch (err) {
            throw err;
        }
    }
    async searchBlog(req){
        try{
            
            let { titulo } = req.query;

            let blogs = await models.blog.Blog.findAll({ where: { titulo: { [Op.substring]: titulo } } });

            return blogs?.length
                ? new AppResponse(200, blogs)
                : new AppResponse(500, null, 'No se encontraron resultados al titulo buscado.');

        }catch(err){
            throw err;
        }
    }
    async createBlog(req) {
        try {
            let { idUsuario }     = req.userData;
            let archivo           = req.file;
            let blog              = req.body;

            if(!blog?.titulo || !blog?.html) return new AppResponse(500,null,'No cumple con los datos requeridos para crear blog: (titulo y html)');
            
            blog.idBlog = null;

            if(archivo){
                let { originalname: nombre } = archivo;

                let extName = path.extname(nombre);

                if(!['.png','.jpg','.jpeg','.gif'].includes(extName)) return new AppResponse(500,null,'La extencion no pertence a una imagen permitidos: (png,jpeg,jpg,gif)');

                let { url,nombreServer } = await this.createImgBlogS3(archivo);
                blog.idUsuarioCreacion = idUsuario;
                blog.nombreImgServer   = nombreServer;
                blog.nombreImg         = nombre;
                blog.urlImgCabecera    = url;
            }
            
            let blogCreado = await models.blog.Blog.create(blog);

            return new AppResponse( 200, blogCreado, 'Blog creado correctamente')
        } catch (err) {
            throw err;
        }
    }
    async putBlog(req) {
        try {
            let { id: idBlog } = req.params;
            let { idUsuario }  = req.userData;
            let archivo        = req.file;
            let blog           = req.body;

            delete blog.idBlog;

            let existBlog = await models.blog.Blog.findOne({ where: { idBlog } });

            if(!existBlog) return new AppResponse(500,null,'No existe el blog a actualizar.');

            if(archivo && existBlog?.urlImgCabecera && existBlog?.nombreImgServer){
                let deleteFile = await utilitiesService.deleteFileS3(existBlog.nombreImgServer);
            }

            if(archivo){
                let { originalname: nombre } = archivo;

                let extName = path.extname(nombre);

                if(!['.png','.jpg','.jpeg','.gif'].includes(extName)) return new AppResponse(500,null,'La extencion no pertence a una imagen permitidos: (png,jpeg,jpg,gif)');

                let { url,nombreServer } = await this.createImgBlogS3(archivo);
                blog.urlImgCabecera      = url;
                blog.nombreImg           = nombre.originalname;
                blog.nombreImgServer     = nombreServer;
            }

            await models.blog.Blog.update(blog, { where: { idBlog } });

            return new AppResponse( 200, null, 'Blog actualizado correctamente')
        } catch (err) {
            throw err;
        }
    }
    async deleteBlog(req) {
        try {
            let { id: idBlog } = req.params;

            let existBlog = await models.blog.Blog.findOne({where: { idBlog } });

            if(!existBlog) return new AppResponse(500,null,'No existe el blog a eliminar.');

            if(existBlog?.urlImgCabecera && existBlog?.nombreImgServer){
                let deleteFile  = await utilitiesService.deleteFileS3(existBlog.nombreImgServer);
            }

            let blog = await models.blog.Blog.destroy({ where: { idBlog } });
            await models.blog.BlogComentario.destroy({ where: { idBlog } });
            return new AppResponse(200 ,null ,'Blog eliminado correctamente');
        } catch (err) {
            throw err;
        }
    }

    async createImgBlogS3(archivo){
        try{
            let { originalname: nombre } = archivo;
            let nameFile = uuidv4() + path.extname(nombre);
            let url      = await utilitiesService.uploadFileS3( nameFile , archivo.buffer );

            return {
                url,
                nombreServer: nameFile
            }
        }catch(err){
            throw err;
        }
    }

    async getComentario(req){
        try{
            let { id: idComentario } = req.params;

            let existComentario = await models.blog.BlogComentario.findOne({ where: { idComentario } })

            if(!existComentario) return new AppResponse(500,null,'No se encontro informacion del comentario.');

            let comentario = await models.blog.BlogComentario.findOne({
                where:{ idComentario },
                include:[
                    {
                        model: models.blog.Usuario,
                        as:'UsuarioCreacion',
                        attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                    },
                    {
                        model: models.blog.Usuario,
                        as:'UsuarioModificacion',
                        attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                    },
                ]
            });

            return new AppResponse(200,comentario);
        }catch(err){
            throw err;
        }
    }

    async createComentario(req){
        try{
            let { idUsuario } = req.userData;
            let { id: idBlog } = req.params;
            let comentario = req.body;
            
            comentario.idComentario      = null;
            comentario.idUsuarioCreacion = idUsuario;
            comentario.idBlog            = idBlog;

            let exist = await models.blog.Blog.findOne({ where: { idBlog } })

            if(!exist) return new AppResponse(500,null,'No existe blog para agregar comentario.');
            
            let newComentario = await models.blog.BlogComentario.create(comentario);

            return new AppResponse(200, newComentario, 'Comentario creado correctamente.');
        }catch(err){
            throw err;
        }
    }
    async putComentario(req){
        try{
            let { idUsuario } = req.userData;
            let { id: idBlog, idComentario } = req.params;
            let comentario = req.body;

            if(!comentario?.comentario) return new AppResponse(500,null,'No cuenta con comentario para actualizar.');

            let existBlog = await models.blog.Blog.findOne({ where: { idBlog } })

            if(!existBlog) return new AppResponse(500,null,'No existe blog para agregar comentario.');

            delete comentario.idComentario;
            delete comentario.idBlog;
            comentario.idUsuarioModificacion = idUsuario;

            let existComentario = await models.blog.BlogComentario.findOne({ where: { idComentario } });

            if(!existComentario) return new AppResponse(500,null,'No existe comentario para actualizar');
            
            let comentarioActualizado = await models.blog.BlogComentario.update(comentario,{ where: { idBlog, idComentario } });
            await models.blog.Blog.update({ idUsuarioModificacion: idUsuario }, { where: { idBlog } } );

            return new AppResponse(200, null, 'Comentario actualizado correctamente');
        }catch(err){
            throw err;
        }
    }
    async deleteComentario(req){
        try{
            let { idUsuario } = req.userData;
            let { id: idBlog, idComentario } = req.params;

            let existBlog = await models.blog.Blog.findOne({ where: { idBlog } })

            if(!existBlog) return new AppResponse(500,null,'No existe blog para eliminar comentario.');
            
            let existComentario = await models.blog.BlogComentario.findOne({ where: { idComentario } })

            if(!existComentario) return new AppResponse(500,null,'No existe comentario para eliminar.');

            await models.blog.BlogComentario.destroy({ where: { idBlog, idComentario } });
            await models.blog.Blog.update({ idUsuarioModificacion: idUsuario },{ where: { idBlog } });

            return new AppResponse(200, null, 'Comentario eliminado correctamente.');
        }catch(err){
            throw err;
        }
    }
}

module.exports = new BlogService();

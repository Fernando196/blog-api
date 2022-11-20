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

            // Utilizamos operadores de sequelize para aplicar like %valor% para la busqueda por titulo
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

            // Enviamos mensaje de error en caso que no cumpla con los datos minimos
            if(!blog?.titulo || !blog?.html) return new AppResponse(500,null,'No cumple con los datos requeridos para crear blog: (titulo y html)');
            
            blog.idBlog = null;

            // Validamos si existe archivo agregado en la peticion en caso omiso se procede a crear bllog.
            if(archivo){
                let { originalname: nombre } = archivo;

                let extName = path.extname(nombre);

                // Validamos que el archivo a subir cumpla con las extenciones validas.
                if(!['.png','.jpg','.jpeg','.gif'].includes(extName)) return new AppResponse(500,null,'La extencion no pertence a una imagen permitidos: (png,jpeg,jpg,gif)');

                // Subimos el archivo al aws S3
                let { url,nombreServer } = await this.createImgBlogS3(archivo);

                // Agregamos propiedades del archivo al objeto blog para su creacion.
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
            
            if(archivo){
                let { originalname: nombre } = archivo;

                let extName = path.extname(nombre);

                // Validamos si el nuevo archivo cumple con la extencion valida.
                if(!['.png','.jpg','.jpeg','.gif'].includes(extName)) return new AppResponse(500,null,'La extencion no pertence a una imagen permitidos: (png,jpeg,jpg,gif)');

                let { url,nombreServer } = await this.createImgBlogS3(archivo);
                blog.urlImgCabecera      = url;
                blog.nombreImg           = nombre.originalname;
                blog.nombreImgServer     = nombreServer;
            }

            // En caso de tener imagen ya almacenada, validamos y procedemos a eliminar en s3.
            if(archivo && existBlog?.urlImgCabecera && existBlog?.nombreImgServer){
                let deleteFile = await utilitiesService.deleteFileS3(existBlog.nombreImgServer);
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

            // Si existe imagen almacenada en s3, procedemos a eliminar.
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
            
            // Validamos si existe el blog para crear comentario.
            let existBlog = await models.blog.Blog.findOne({ where: { idBlog } })

            if(!existBlog) return new AppResponse(500,null,'No existe blog para agregar comentario.');

            // Eliminamos id primario para no causar conflicto al crear comentario.
            comentario.idComentario      = null;

            // Agregamos propiedades para poder crear comentario.
            comentario.idUsuarioCreacion = idUsuario;
            comentario.idBlog            = idBlog;
            
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

            // Validamos que cumpla con la propiedad comentario, en caso omiso enviar mensaje de error.
            if(!comentario?.comentario) return new AppResponse(500,null,'No cuenta con comentario para actualizar.');

            // Validamos que existe el blog en el cual vamos a crear el comentario.
            let existBlog = await models.blog.Blog.findOne({ where: { idBlog } })

            if(!existBlog) return new AppResponse(500,null,'No existe blog para agregar comentario.');

            // Eliminamos llaves para no causar conflicto al modificar comentario.
            delete comentario.idComentario;
            delete comentario.idBlog;
            
            // Agregamos propiedad de usuario que modifica el comentario.
            comentario.idUsuarioModificacion = idUsuario;

            let existComentario = await models.blog.BlogComentario.findOne({ where: { idComentario } });

            if(!existComentario) return new AppResponse(500,null,'No existe comentario para actualizar');
            
            let comentarioActualizado = await models.blog.BlogComentario.update(comentario,{ where: { idBlog, idComentario } });

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

            // Eliminamos comentario y actualizamos blog el usuario que modifica.
            await models.blog.BlogComentario.destroy({ where: { idBlog, idComentario } });
            await models.blog.Blog.update({ idUsuarioModificacion: idUsuario },{ where: { idBlog } });

            return new AppResponse(200, null, 'Comentario eliminado correctamente.');
        }catch(err){
            throw err;
        }
    }
}

module.exports = new BlogService();

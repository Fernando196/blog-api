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
                ]
            });

            return blog
                ? new AppResponse( 200, blog ) 
                : new AppResponse( 404, null , "No se encontro blog");
        } catch (error) {
            throw error;
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
            console.log(err)
            throw err;
        }
    }
    async createBlog(req) {
        try {
            let { idUsuario }     = req.userData;
            let archivo           = req.file;
            let blog              = req.body;
            
            let { originalname: nombre } = archivo;

            let extName = path.extname(nombre);

            if(!['.png','.jpg','.jpeg','.gif'].includes(extName)) return new AppResponse(500,null,'La extencion no pertence a una imagen permitidos: (png,jpeg,jpg,gif)');

            let { url,nombreServer } = await this.createImgBlogS3(archivo);

            blog.idBlog            = null;
            blog.idUsuarioCreacion = idUsuario;
            blog.nombreImgServer   = nombreServer;
            blog.nombreImg         = nombre;
            blog.urlImgCabecera    = url;
            
            let blogCreado = await models.blog.Blog.create(blog);

            return new AppResponse( 200, blogCreado )
        } catch (error) {
            throw error;
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
                await utilitiesService.deleteFileS3(existBlog.nombreImgServer);
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

            return new AppResponse(200,'Blog actualizado correctamente')
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteBlog(req) {
        try {
            let { id: idBlog } = req.params;

            let existBlog = await models.blog.Blog.findOne({where: { idBlog } });

            if(!existBlog) return new AppResponse(500,null,'No existe el blog a eliminar.');

            if(existBlog?.urlImgCabecera && existBlog?.nombreImgServer){
                await utilitiesService.deleteFileS3(existBlog.nombreImgServer);
            }

            let blog = await models.blog.Blog.destroy({ where: { idBlog } });
            await models.blog.BlogComentario.destroy({ where: { idBlog } });
            return new AppResponse(200,'Blog eliminado correctamente');
        } catch (error) {
            throw error;
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
}

module.exports = new BlogService();

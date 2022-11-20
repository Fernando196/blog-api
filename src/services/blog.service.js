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

            let { query } = req;
            query = {
                ...query,
                //   where: { activo: 1 }
            }
            let blog = await models.blog.Blog.findAll(qParams);

            return blog
                ? new AppResponse( 200, blog ) 
                : new AppResponse( 404, null , ["No se encontraron Blog"]);
        } catch (error) {
            throw error;
        }
    }
    async createBlog(req) {
        try {
            let archivo           = req.file;
            let { idUsuario }     = req.userData;
            let blog              = req.body;
            
            let { originalname: nombre } = archivo;

            let extName = path.extname(nombre);

            if(!['png','jpg','jpeg','gif'].includes(extName)) return new AppResponse(500,null,'La extencion no pertence a una imagen permitidos: (png,jpeg,jpg,gif)');

            let folder   = process.env.AWS_IMAGES_FOLDER;

            let nameFile = uuidv4() + path.extname(nombre);

            let url = await utilitiesService.uploadFileS3( `${folder}${nameFile}` , archivo.buffer );

            blog.idBlog            = null;
            blog.idUsuarioCreacion = idUsuario;
            blog.nombreImgServer   = nameFile;
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
            let { body: blog, params } = req;
            let { id: idBlog } = params;
            delete blog.idBlog;
            let blogActualizado = await models.blog.Blog.update(blog, { where: { idBlog } });
            return new AppResponse(200,blogActualizado)
        } catch (error) {
            throw error;
        }
    }
    async patchBlog(){
        try{
            let { body: data, params } = req;
            let { id: idBlog } = params;

            let blogActualizado = await models.blog.Blog.update(data, { where: { idBlog } });
            return new AppResponse(200,blogActualizado)
        }catch(error){
            throw error;
        }
    }
    async deleteBlog(req) {
        try {

            let { id: idBlog } = req.params;
            let blog = await models.blog.Blog.update({ activo: 0 }, { where: { idBlog } });
            return new AppResponse(200,blog)
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BlogService();

const models = require("../models");
const sequelize = require('sequelize');
const AppResponse = require("../classes/appResponse");
const Op = sequelize.Op;

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
                ? new AppResponse(200, "", blog) 
                : new AppResponse(404, ["No se encontraron Blog"]);
        } catch (error) {
            throw error;
        }
    }
    async createBlog(req) {
        try {
            let { idUsuario } = req.userData;
            let blog = req.body;
            
            blog.idBlog = null;
            blog.idUsuarioCreacion = idUsuario;
            
            let blogCreado = await models.blog.Blog.create(blog);

            return new AppResponse(200, "", blogCreado)
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
            return new AppResponse(200, "", blogActualizado)
        } catch (error) {
            throw error;
        }
    }
    async patchBlog(){
        try{
            let { body: data, params } = req;
            let { id: idBlog } = params;

            let blogActualizado = await models.blog.Blog.update(data, { where: { idBlog } });
            return new AppResponse(200, "", blogActualizado)
        }catch(error){
            throw error;
        }
    }
    async deleteBlog(req) {
        try {

            let { id: idBlog } = req.params;
            let blog = await models.blog.Blog.update({ activo: 0 }, { where: { idBlog } });
            return new AppResponse(200, "", blog)
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BlogService();

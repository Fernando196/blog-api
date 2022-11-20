const models = require("../models");
const sequelize = require('sequelize');
const AppResponse = require("../classes/appResponse");
const Op = sequelize.Op;
const bcrypt = require('bcryptjs');

class UsuarioService{
    async createUsuario(req) {
        try {
            let usuario = req.body;

            if(!usuario?.password || !usuario?.email || !usuario?.nombre){
                return new AppResponse(500,null,'No cumple con los datos requeridos para crear usuario: (email,password,nombre)')
            }

            let existEmail = await models.blog.Usuario.findOne({ where: { email: usuario.email } });

            if(existEmail){
                return new AppResponse(500,null,'El email ya se encuentra en uso.');
            }

            usuario.idUsuario = null;
            usuario.password = bcrypt.hashSync(usuario.password)
            let usuarioCreado = await models.blog.Usuario.create(usuario);

            return new AppResponse(200,'Usuario creado correctamente.');
        } catch (error) {
            throw error;
        }
    }
    async putUsuario(req) {
        try {
            let { body: usuario, params } = req;
            let { id: idUsuario } = params;
            delete usuario.idUsuario;
            let usuarioActualizado = await models.blog.Usuario.update(usuario, { where: { idUsuario } });
            return new AppResponse(200, "", usuarioActualizado)
        } catch (error) {
            throw error;
        }
    }

    async pathUsuario(req) {
        try {
            let { body: data, params } = req;
            let { id: idUsuario } = params;

            let usuarioActualizado = await models.blog.Usuario.update(data, { where: { idUsuario } });
            return new AppResponse(200, "", usuarioActualizado)
        } catch (error) {
            throw error;
        }
    }

    async deleteUsuario(req) {
        try {

            let { id: idUsuario } = req.params;
            let usuario = await models.blog.Usuario.update({ activo: 0 }, { where: { idUsuario } });
            return new AppResponse(200, "", usuario)
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UsuarioService();

const models = require("../models");
const sequelize = require('sequelize');
const AppResponse = require("../classes/appResponse");
const Op = sequelize.Op;
const bcrypt = require('bcryptjs');

class UsuarioService{

    async getUsuario(req){
        try{

            let { id: idUsuario } = req.params;

            let usuario = await models.blog.Usuario.findOne({ 
                where: { idUsuario },
                include:[
                    {
                        model: models.blog.Usuario,
                        as:'UsuarioModificacion',
                        attributes:[ 'nombre', 'apellidoPaterno', 'apellidoMaterno' ]
                    },
                ]
            });

            return new AppResponse(200,usuario)

        }catch(err){
            throw err;
        }
    }

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

            return new AppResponse(200,'Usuario creado correctamente.',usuarioCreado);
        } catch (err) {
            throw err;
        }
    }
    async putUsuario(req) {
        try {
            let { id: idUsuarioModificacion } = req.userData;
            let { id: idUsuario } = req.params;
            let { body: usuario } = req;

            let existUsuario = await models.blog.Usuario.findOne({ where: { idUsuario } });

            if(!existUsuario) return new AppResponse(500, null, 'No existe usuario para actualizar' );

            if(usuario?.email){
                let existEmail = await models.blog.Usuario.findOne({ where: { email: usuario.email } });

                if(existEmail) return new AppResponse(500,null,'El email que se intenta cambiar, ya se encuentra en uso.');
            }

            delete usuario.idUsuario;
            usuario.idUsuarioModificacion = idUsuarioModificacion;

            let usuarioActualizado = await models.blog.Usuario.update(usuario, { where: { idUsuario } });
            return new AppResponse(200, null, 'Usuario actualizado correctamente.');
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async deleteUsuario(req) {
        try {
            let { id: idUsuario } = req.params;

            let existUsuario = await models.blog.Usuario.findOne({ where: { idUsuario } });

            if(!existUsuario) return new AppResponse(500, null, 'No existe usuario para eliminar' );

            let blog = await models.blog.Blog.findOne({ 
                where: { 
                    [Op.or]: {
                        idUsuarioCreacion: idUsuario,
                        idUsuarioModificacion: idUsuario
                    } 
                }
            });

            let comentarios = await models.blog.BlogComentario.findOne({
                where: { 
                    [Op.or]: {
                        idUsuarioCreacion: idUsuario,
                        idUsuarioModificacion: idUsuario
                    } 
                }
            });

            if(blog ||  comentarios) return new AppResponse(500, null, 'El usuario tiene informacion capturada, favor de eliminar para proceder a eliminar usuario.');

            await models.blog.Usuario.destroy({ where: { idUsuario } });
            return new AppResponse(200, null, 'Usuario eliminado correctamente');
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
}

module.exports = new UsuarioService();

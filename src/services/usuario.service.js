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

            return usuario
                ? new AppResponse(200, usuario)
                : new AppResponse(500, null, 'No se encontro informacion del usuario.');

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
            
            // Revisamos email existe, en caso que exista enviar error.
            let existEmail = await models.blog.Usuario.findOne({ where: { email: usuario.email } });

            if(existEmail){
                return new AppResponse(500,null,'El email ya se encuentra en uso.');
            }
            
            // Se elimina id primario para no causar conflicto al crear usuario.
            usuario.idUsuario = null;
            // Se aplica encryptacion a password.
            usuario.password = bcrypt.hashSync(usuario.password)
            let usuarioCreado = await models.blog.Usuario.create(usuario);

            return new AppResponse(200,usuarioCreado,'Usuario creado correctamente.');
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

            //Revisamos si estamos actualizando el email y verificar el si ya esta en uso.
            if(usuario?.email){
                let existEmail = await models.blog.Usuario.findOne({ where: { email: usuario.email } });

                if(existEmail) return new AppResponse(500,null,'El email que se intenta cambiar, ya se encuentra en uso.');
            }

            //Se elimina id primario para no causar conflicto al modificar usuario;
            delete usuario.idUsuario;

            //Se agrega idUsuario modificacion para llevar un registro.
            usuario.idUsuarioModificacion = idUsuarioModificacion;

            let usuarioActualizado = await models.blog.Usuario.update(usuario, { where: { idUsuario } });
            return new AppResponse(200, null, 'Usuario actualizado correctamente.');
        } catch (err) {
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

            // Enviamos mensaje de error en caso que existe blog o comentario existente.
            if(blog ||  comentarios) return new AppResponse(500, null, 'El usuario tiene informacion capturada, favor de eliminar para proceder a eliminar usuario.');

            await models.blog.Usuario.destroy({ where: { idUsuario } });
            return new AppResponse(200, null, 'Usuario eliminado correctamente');
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UsuarioService();

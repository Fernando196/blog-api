//Response
const AppResponse = require('../classes/appResponse');

//Sequelize
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class AuthService{
    getTokenPayLoad(user){
        return{
            idUsuario: user.idUsuario,
            nombre: user.nombre,
            email: user.email,
            apellidoPaterno: user.apellidoPaterno,
            apellidoMaterno: user.apellidoMaterno
        }
    }

    async doLogin(req){
        try{
            let { body: usuario } = req;
            if(!usuario?.email && !usuario.password) return new AppResponse(500,null,'No cumple con los datos requeridos para inicar sesion.');
            
            let user = await models.blog.Usuario.findOne({where: { email: usuario.email }});

            if(!user) return new AppResponse(500,null,'Credenciales invalidas');

            if(bcrypt.compareSync(usuario.password,user.password)){
                
                user = this.getTokenPayLoad(user);
                let token = jwt.sign(user,process.env.SEED_API_BLOG,{
                    expiresIn: Number(process.env.TOKEN_EXPIRATION)
                });

                user.token = token;
                user.refresh = uuidv4();
                user.expiresIn = Number(process.env.TOKEN_EXPIRATION) - 1;

                return new AppResponse(200,user);
            }else{
                return new AppResponse(500,null,'Credenciales invalidas');
            }

        }catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = new AuthService();
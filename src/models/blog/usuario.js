module.exports = function(sequelize, DataTypes) {
	const Usuario = sequelize.define('Usuario', {
		idUsuario: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			field: 'idUsuario'
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'email'
		},
		password: {
			type: DataTypes.STRING(300),
			allowNull: false,
			field: 'password'
		},
		nombre: {
			type: DataTypes.STRING(500),
			allowNull: false,
			field: 'nombre'
		},
		apellidoPaterno: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'apellidoPaterno'
		},
		apellidoMaterno: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'apellidoMaterno'
		},
		fechaCreacion: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'fechaCreacion',
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
		idUsuarioModificacion: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'idUsuarioModificacion'
		},
		fechaModificacion: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'fechaModificacion'
		}
	}, {
		tableName: 'usuario',
		timestamps: false,
	});

	Usuario.associate = (models) => {
		Usuario.belongsTo(models.blog.Usuario, {
			foreignKey : 'idUsuarioModificacion',
			targetKey  : 'idUsuario',
			as		   : 'UsuarioModificacion'
		})
	}

	return Usuario;
};

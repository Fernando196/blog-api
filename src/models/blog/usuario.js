module.exports = function(sequelize, DataTypes) {
	const Usuario = sequelize.define('Usuario', {
		idUsuario: {
			type: DataTypes.INTEGER,
			allowNull: false,
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

	return Usuario;
};

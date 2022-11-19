module.exports = function(sequelize, DataTypes) {
	return sequelize.define('usuarioToken', {
		idUsuarioToken: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			field: 'idUsuarioToken'
		},
		idUsuario: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'usuario',
				key: 'idUsuario'
			},
			field: 'idUsuario'
		},
		token: {
			type: DataTypes.STRING(1000),
			allowNull: true,
			field: 'token'
		},
		expedido: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'expedido'
		},
		ultimoUso: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'ultimoUso'
		}
	}, {
		tableName: 'usuarioToken',
		timestamps: false,
	});
};

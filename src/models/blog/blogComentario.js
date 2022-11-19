module.exports = function(sequelize, DataTypes) {
	const BlogComentario = sequelize.define('BlogComentario', {
		idComentario: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			field: 'idComentario'
		},
		idBlog: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'idBlog'
		},
		comentario: {
			type: DataTypes.STRING(500),
			allowNull: true,
			field: 'comentario'
		},
		idUsuarioCreacion: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'usuario',
				key: 'idUsuario'
			},
			field: 'idUsuarioCreacion'
		},
		fechaCreacion: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'fechaCreacion'
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
		tableName: 'blogComentario',
		timestamps: false,
	});

	BlogComentario.associate = (models)=>{
		BlogComentario.belongsTo(models.blog.Usuario,{
			foreingKey:'idUsuarioCreacion',
			targetKey:'idUsuario',
			as:'UsuarioCreacion'
		});
		BlogComentario.belongsTo(models.blog.Usuario,{
			foreingKey:'idUsuarioModificacion',
			targetKey:'idUsuario',
			as:'UsuarioModificacion'
		});
	}
	
	return BlogComentario;
};

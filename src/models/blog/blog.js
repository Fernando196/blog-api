module.exports = function(sequelize, DataTypes) {
	const Blog = sequelize.define('Blog', {
		idBlog: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			field: 'idBlog'
		},
		titulo: {
			type: DataTypes.STRING(300),
			allowNull: true,
			field: 'titulo'
		},
		nombreImg:{
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'nombreImg'
		},
		nombreImgServer:{
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'nombreImgServer'
		},
		urlImgCabecera: {
			type: DataTypes.STRING(500),
			allowNull: true,
			field: 'urlImgCabecera'
		},
		html: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'html'
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
		tableName: 'blog',
		timestamps: false,
	});

	Blog.associate = (models)=>{
		Blog.belongsTo(models.blog.Usuario,{
			foreignKey:'idUsuarioCreacion',
			targetKey:'idUsuario',
			as:'UsuarioCreacion'
		});
		Blog.belongsTo(models.blog.Usuario,{
			foreignKey:'idUsuarioModificacion',
			targetKey:'idUsuario',
			as:'UsuarioModificacion'
		});
		Blog.hasMany(models.blog.BlogComentario,{
			foreignKey:'idBlog',
			as:'Comentarios'
		})
	}

	return Blog;
};

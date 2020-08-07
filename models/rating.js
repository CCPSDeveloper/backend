/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('rating', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userby: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userby'
		},
		userTo: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userTo'
		},
		ratings: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: 'ratings'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'description'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'type'
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updated_at'
		}
	}, {
		tableName: 'rating'
	});
};

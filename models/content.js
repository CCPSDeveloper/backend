/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('content', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		term: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'term'
		},
		privacy: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'privacy'
		},
		about: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'about'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'content'
	});
};

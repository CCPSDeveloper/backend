/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('favourite', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user_id'
		},
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'provider_id'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'description'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'status'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'type'
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
			field: 'updated_at'
		}
	}, {
		tableName: 'favourite'
	});
};

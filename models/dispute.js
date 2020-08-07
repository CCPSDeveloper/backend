/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('dispute', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'order_id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'user_id'
		},
		title: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'title'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'description'
		},
		image: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'image'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'updated_at'
		}
	}, {
		tableName: 'dispute'
	});
};

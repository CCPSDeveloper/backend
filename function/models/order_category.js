/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('orderCategory', {
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
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'category',
				key: 'id'
			},
			field: 'category_id'
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
		tableName: 'order_category'
	});
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('orderSubcategory', {
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
			field: 'category_id'
		},
		subcategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'subCategory',
				key: 'id'
			},
			field: 'subcategory_id'
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'price'
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
		tableName: 'order_subcategory'
	});
};

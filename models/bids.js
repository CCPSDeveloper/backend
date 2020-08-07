/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bids', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'provider_id'
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'order_id'
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'price'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'description'
		},

		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'updated_at'
		}
	}, {
		tableName: 'bids',
		timestamps:false
	});
};

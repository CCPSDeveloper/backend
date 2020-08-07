/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bids', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'provider_id'
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'order_id'
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: 'price'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'status'
		},
		created: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'created'
		},
		updated: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'updated'
		}
	}, {
		tableName: 'bids',
		timestamps:false
	});
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('invoice', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
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
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'provider_id'
		},
		cardId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'card_id'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'type'
		},
		amount: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'amount'
		},
		tip: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'tip'
		},
		adminFees: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'admin_fees'
		},
		transectionId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'transection_id'
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'data'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_at'
		}
	}, {
		tableName: 'invoice'
	});
};

/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('withdrawal', {
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
			references: {
				model: 'provider',
				key: 'id'
			},
			field: 'provider_id'
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'order',
				key: 'id'
			},
			field: 'order_id'
		},
		amount: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'amount'
		},
		isPaid: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'is_paid'
		},
		providerEarning: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'provider_earning'
		},
		adminCommission: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'admin_commission'
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
		tableName: 'withdrawal'
	});
};

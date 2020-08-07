/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('invoice', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: {
					tableName: 'order',
				},
				key: 'id'
			},
			field: 'order_id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: {
					tableName: 'user',
				},
				key: 'id'
			},
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
			comment: '0=paypal,1=card'
		},
		amount: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		tip: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		adminFees: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'admin_fees'
		},
		providerFees: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'provider_fees'
		},
		transectionId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'transection_id'
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: true
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
		sequelize,
		tableName: 'invoice'
	});
};

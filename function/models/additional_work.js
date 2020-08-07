/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('additionalWork', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'order_id'
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
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'title'
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'price'
		},
		image: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'image'
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
		tableName: 'additional_work'
	});
};

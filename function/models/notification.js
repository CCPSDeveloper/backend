/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notification', {
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
		userType: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			field: 'user_type'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user_id'
		},
		user2Id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user2_id'
		},
		message: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'message'
		},
		isSeen: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'is_seen'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'type'
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'updatedAt'
		}
	}, {
		tableName: 'notification',
		timestamps:false,
	});
};

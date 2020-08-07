/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chat', {
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
		constantId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			field: 'constant_id'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'type'
		},
		isRead: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'is_read'
		},
		msgType: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'msg_type'
		},
		message: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'message'
		},
		user2Id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user2id'
		},
		createdAt: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'updated_at'
		}
	}, {
		tableName: 'chat',
		timestamps:false
	});
};

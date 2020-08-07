/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('constant', {
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
		user2Id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'user2id'
		},
		lastMsgId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'last_msg_id'
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
		tableName: 'constant'
	});
};

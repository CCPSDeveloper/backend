/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userIdentity', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'user_id'
		},
		frontImage: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'front_image'
		},
		backImage: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'back_image'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(11),
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
		tableName: 'user_identity'
	});
};

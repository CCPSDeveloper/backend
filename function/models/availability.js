/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('availability', {
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
		day: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'day'
		},
		fromTime: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'from_time'
		},
		toTime: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'to_time'
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
		tableName: 'availability'
	});
};

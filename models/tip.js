/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tip', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'price'
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
		tableName: 'tip'
	});
};

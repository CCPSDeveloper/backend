/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userCards', {
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
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'name'
		},
		cardNumber: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'card_number'
		},
		expYear: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'exp_year'
		},
		expMonth: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'exp_month'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
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
		tableName: 'user_cards'
	});
};

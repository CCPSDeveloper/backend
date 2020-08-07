/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('setting', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		comission: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'comission'
		},
		tax: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'tax'
		},
		paypalEmail: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'paypal_email'
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'password'
		},
		accountNumber: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'account_number'
		},
		searchDistance: {
			type: DataTypes.BIGINT(),
			allowNull: false,
			field: 'search_distance'
		},
		bankName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'bank_name'
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
		tableName: 'setting'
	});
};

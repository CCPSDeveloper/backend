/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('admin', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'email'
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'password'
		},
		forgot_password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'forgot_password'
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'image'
		},
		logo: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'logo'
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'name'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
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
		tableName: 'admin'
	});
};

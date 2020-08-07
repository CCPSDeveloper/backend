/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'name'
		},
		firstName: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'email'
		},
		countryCode: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'country_code'
		},
		phone: {
			type: DataTypes.STRING(15),
			allowNull: true,
			field: 'phone'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'description'
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'password'
		},
		forgotPassword: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'forgot_password'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
		},
		ngo: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'ngo'
		},
		age: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'age'
		},
		dob: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'dob'
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'image'
		},
		city: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'city'
		},
		state: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'state'
		},
		socialId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'social_id'
		},
		socialType: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'social_type'
		},
		location: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'location'
		},
		latitude: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'latitude'
		},
		longitude: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'longitude'
		},
		deviceType: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'device_type'
		},
		deviceToken: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'device_token'
		},
		authKey: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'auth_key'
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
		tableName: 'user'
	});
};

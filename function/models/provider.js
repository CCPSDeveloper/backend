/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('provider', {
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
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'email'
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
		countryCode: {
			type: DataTypes.STRING(10),
			allowNull: true,
			field: 'country_code'
		},
		state: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'state'
		},
		city: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'city'
		},
		phone: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'phone'
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'image'
		},
		profession: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'profession'
		},
		dob: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'dob'
		},
		age: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'age'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'description'
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'category_id'
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
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
		},
		online: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'online'
		},
		price: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'price'
		},
		tip: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'tip'
		},
		isApprove: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'is_approve'
		},
		isRead: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'is_read'
		},
		businessLicence: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'business_licence'
		},
		driverLicence: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'driver_licence'
		},
		socialSecurityNo: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'social_security_no'
		},
		insurance: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'insurance'
		},
		resume: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'resume'
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'address'
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'latitude'
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'longitude'
		},
		authKey: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'auth_key'
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
		paypalId: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'paypal_id'
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
		tableName: 'provider'
	});
};

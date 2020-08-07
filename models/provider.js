/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('provider', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
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
		street: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'street'
		},
		houseNumber: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'house_number'
		},
		appartment: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'appartment'
		},
		zipCode: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'zip_code'
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
		dob: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'dob'
		},
		age: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'age'
		},
		isEmailVerify: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'is_email_verify'
		},
		otp: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'otp'
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
		online: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'online'
		},
		profession: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'profession'
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
		tagId: {
			type: DataTypes.STRING(200),
			allowNull: true,
			field: 'tag_id'
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
		tableName: 'provider'
	});
};

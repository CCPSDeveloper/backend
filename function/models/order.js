/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('order', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'user',
				key: 'id'
			},
			field: 'user_id'
		},
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'provider_id'
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'title'
		},
		estimationPrice: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'estimation_price'
		},
		estimationTime: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'estimation_time'
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'description'
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
		location: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'location'
		},
		state: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'state'
		},
		zipCode: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'zip_code'
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'city'
		},
		street: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'street'
		},
		number: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'number'
		},
		appartment: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'appartment'
		},
		date: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'date'
		},
		time: {
			type: DataTypes.STRING(50),
			allowNull: true,
			field: 'time'
		},
		startjobDate: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'startjob_date'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
		},
		type: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'type'
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
		tableName: 'order'
	});
};

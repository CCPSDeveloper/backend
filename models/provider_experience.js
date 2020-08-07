/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('providerExperience', {
		id: {
			autoIncrement: true,
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true
		},
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'provider_id'
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		experienceType: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'experience_type'
		},
		company: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		location: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		currentlyWorking: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'currently_working'
		},
		startDate: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'start_date'
		},
		endDate: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'end_date'
		},
		description: {
			type: DataTypes.TEXT,
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
		tableName: 'provider_experience'
	});
};

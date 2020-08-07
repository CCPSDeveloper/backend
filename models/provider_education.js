/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('providerEducation', {
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
		school: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		degree: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		studyType: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'study_type'
		},
		startDate: {
			type: DataTypes.STRING(30),
			allowNull: true,
			field: 'start_date'
		},
		endDate: {
			type: DataTypes.STRING(30),
			allowNull: true,
			field: 'end_date'
		},
		grade: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		activity: {
			type: DataTypes.STRING(255),
			allowNull: true
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
		tableName: 'provider_education'
	});
};

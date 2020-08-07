/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('favJobs', {
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
		jobId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'job_id'
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
		tableName: 'fav_jobs'
	});
};

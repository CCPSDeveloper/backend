/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('faqs', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		question: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'question'
		},
		answer: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'answer'
		},
		status: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'status'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			field: 'updated_at'
		}
	}, {
		tableName: 'faqs'
	});
};

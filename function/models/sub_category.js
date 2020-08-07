/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('subCategory', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'category',
				key: 'id'
			},
			field: 'category_id'
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'name'
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'description'
		},
		image: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'image'
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
			field: 'updated_at'
		}
	}, {
		tableName: 'sub_category'
	});
};

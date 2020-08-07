/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('providerSubCategories', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		providerId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'provider_id'
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'category_id'
		},
		subCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'sub_category_id'
		},
		price: {
			type: "DOUBLE",
			allowNull: true,
			field: 'price'
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
		tableName: 'provider_sub_categories'
	});
};

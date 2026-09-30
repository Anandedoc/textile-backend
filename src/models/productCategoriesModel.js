/** @format */

module.exports = (sequelize, dataTypes) => {
  const ProductCategories = sequelize.define(
    "product_categories",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: dataTypes.INTEGER,
      },
      productTypeId: {
        type: dataTypes.INTEGER,
      },
      name: {
        type: dataTypes.TEXT,
      },
      stockCount: {
        type: dataTypes.INTEGER,
      },
      image: {
        type: dataTypes.TEXT,
      },
      createdBy: {
        type: dataTypes.INTEGER,
      },
      createdTime: {
        type: dataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      timestamps: false,
    }
  );
  return ProductCategories;
};

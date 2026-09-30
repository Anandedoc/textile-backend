module.exports = (sequelize, dataTypes) => {
  const ProductDetails = sequelize.define(
    "product_details",
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
      productCategoryId: {
        type: dataTypes.INTEGER,
      },
      isSimilarProduct: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
      name: {
        type: dataTypes.TEXT,
      },
      description: {
        type: dataTypes.TEXT,
      },
      color: {
        type: dataTypes.TEXT,
      },
      discountPrice: {
        type: dataTypes.INTEGER,
      },
      actualPrice: {
        type: dataTypes.INTEGER,
      },
      priceFor5: {
        type: dataTypes.INTEGER,
      },
      priceFor10: {
        type: dataTypes.INTEGER,
      },
      priceFor15: {
        type: dataTypes.INTEGER,
      },
      createdTime: {
        type: dataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      createdBy: {
        type: dataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
  return ProductDetails;
};

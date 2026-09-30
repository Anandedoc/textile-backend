/** @format */

module.exports = (sequelize, dataTypes) => {
  const ProductType = sequelize.define(
    "product_types",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        type: dataTypes.INTEGER,
      },
      image: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      name: {
        type: dataTypes.TEXT,
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

  return ProductType;
};

module.exports = (sequelize, dataTypes) => {
  const ProductImages = sequelize.define(
    "product_images",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true, 
        autoIncrement: true,
        primaryKey: true,
      },
      productDetailId: {
        type: dataTypes.INTEGER,
      },
      image: {
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
  return ProductImages;
};

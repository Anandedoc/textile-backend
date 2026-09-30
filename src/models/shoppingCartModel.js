/** @format */

module.exports = (sequelize, dataTypes) => {
  const ShoppingCart = sequelize.define("shopping_cart", {
    id: {
      type: dataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    productDetailsId: {
      type: dataTypes.INTEGER,
    },
    discountPrice: {
      type: dataTypes.INTEGER,
    },
    actualPrice: {
      type: dataTypes.INTEGER,
    },
    name: {
      type: dataTypes.TEXT,
    },
    color: {
      type: dataTypes.TEXT,
    },
    image: {
      type: dataTypes.TEXT,
    },
    count: {
      type: dataTypes.INTEGER,
    },
    userId: {
      type: dataTypes.INTEGER,
    },
    createdTime: {
      type: dataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  }, {
    timestamps: false,
  });
  return ShoppingCart;
};

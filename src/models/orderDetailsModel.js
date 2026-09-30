/** @format */

module.exports = (sequelize, dataTypes) => {
  const OrderDetails = sequelize.define(
    "order_details",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: dataTypes.INTEGER,
      },
      count: {
        type: dataTypes.INTEGER,
      },
      color: {
        type: dataTypes.TEXT,
      },
      productDetailId: {
        type: dataTypes.INTEGER,
      },
      name: {
        type: dataTypes.TEXT,
      },
      image: {
        type: dataTypes.TEXT,
      },
      amount: {
        type: dataTypes.INTEGER,
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
  return OrderDetails;
};

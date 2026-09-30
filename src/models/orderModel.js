/** @format */

module.exports = (sequelize, dataTypes) => {
  const Orders = sequelize.define(
    "orders",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      orderNumber: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      amount: {
        type: dataTypes.INTEGER,
      },
      count: {
        type: dataTypes.INTEGER,
      },
      address: {
        type: dataTypes.TEXT,
      },
      status: {
        type: dataTypes.TEXT,
      },
      isCOD: {
        type: dataTypes.BOOLEAN,
        defaultValue: true,
      },
      isEditable: {
        type: dataTypes.BOOLEAN,
        defaultValue: true,
      },
      trackingNumber: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      trackingPartnerId: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      isRefunded: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
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
  return Orders;
};

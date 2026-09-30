/** @format */

module.exports = (sequelize, dataTypes) => {
  const Product = sequelize.define( 
    "products",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
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

  return Product;
};

/** @format */

module.exports = (sequelize, dataTypes) => {
  const MultiColors = sequelize.define(
    "multi_colors",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      productDetailId: {
        type: dataTypes.INTEGER,
      },
      color: {
        type: dataTypes.TEXT,
      },
      hexCode: {
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

  return MultiColors;
};

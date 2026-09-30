/** @format */

module.exports = (sequelize, dataTypes) => {
  const Review = sequelize.define(
    "reviews",
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
      rating: {
        type: dataTypes.INTEGER,
      },
      firstName: {
        type: dataTypes.TEXT,
      },
      lastName: {
        type: dataTypes.TEXT,
      },
      email: {
        type: dataTypes.TEXT,
      },
      description: {
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

  return Review;
};

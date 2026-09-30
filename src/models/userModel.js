/** @format */

module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: dataTypes.TEXT,
      },
      lastName: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: dataTypes.TEXT,
      },
      phoneNumber: {
        type: dataTypes.TEXT,
      },
      password: {
        type: dataTypes.TEXT,
      },
      role: {
        type: dataTypes.TEXT,
      },
      doorNo: {
        type: dataTypes.TEXT,
      },
      street: {
        type: dataTypes.TEXT,
      },
      city: {
        type: dataTypes.TEXT,
      },
      pincode: {
        type: dataTypes.TEXT,
      },
      token: {
        type: dataTypes.TEXT,
        allowNull: true
      },
      uuid: {
        type: dataTypes.TEXT,
        allowNull: true  
      },
      isVerified: {
        type: dataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      timestamps: true,
    }
  );

    return User;
};

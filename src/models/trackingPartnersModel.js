module.exports = (sequelize, dataTypes) => {
  const TrackingPartners = sequelize.define(
    "tracking_partners",
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: dataTypes.TEXT,
      },
      url: {
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
  return TrackingPartners;
};

const dbConfig = require("../config/dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");
const { modelAssociation } = require("../modelAssociation");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});


sequelize
  .authenticate()
  .then(() => {
    console.log("connected...");
  })
  .catch((err) => {
    console.log("error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./productModel.js")(sequelize, DataTypes);
db.product_types = require("./productTypesModel.js")(sequelize, DataTypes);
db.product_categories = require("./productCategoriesModel")(
  sequelize,
  DataTypes
);
db.product_images = require("./productImageModel")(sequelize, DataTypes);
db.dashboard_images = require("./dashboardImageModel.js")(sequelize, DataTypes);
db.product_details = require("./productDetailsModel")(sequelize, DataTypes);
db.reviews = require("./reviewModel.js")(sequelize, DataTypes);
db.user = require("./userModel.js")(sequelize, DataTypes);
db.shopping_cart = require("./shoppingCartModel.js")(sequelize, DataTypes);
db.orders = require("./orderModel.js")(sequelize, DataTypes);
db.order_details = require("./orderDetailsModel.js")(sequelize, DataTypes);
db.multi_colors = require("./multiColorModel.js")(sequelize, DataTypes);
db.tracking_partners = require("./trackingPartnersModel.js")(
  sequelize,
  DataTypes
);
db.similar_products = require("./similarProductModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes database re-sync done");
});
modelAssociation(sequelize);

module.exports = db;

require('dotenv').config(); // this is important!

module.exports = {
//   test: {
//     username: "anand",
//     password: "Aa123456@",
//     database: "database_test",
//     host: "localhost",
//     dialect: "mysql",
//   },
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },

  // prod: {
  //   username: process.env.DB_LIVE_USER,
  //   password: process.env.DB_LIVE_PASSWORD,
  //   database: process.env.DB_LIVE_NAME,
  //   host: process.env.DB_LIVE_HOST,
  //   dialect: "mysql",
  // },
};

/** @format */
const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv/config.js");
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");

const productRouter = require("./routes/productRouter.js");
const productTypeRouter = require("./routes/productTypeRouter");
const productCategoriesRouter = require("./routes/productCategoriesRouter");
const productDetailsRouter = require("./routes/productDetailsRouter");
const dashBoardImagesRouter = require("./routes/dashBoardImagesRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const userRouter = require("./routes/userRouter.js");
const authRouter = require("./routes/authRouter.js");
const shoppingCartRouter = require("./routes/shoppingCartRouter.js");
const orderRouter = require("./routes/orderRouter.js");
const trackingPartnerRouter = require("./routes/trackingPartnersRouter.js");
const similarProductsRouter = require("./routes/similarProductsRouter.js");
const HttpError = require("./models/httpErrorModel");

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

//routes
app.use("/api/products", productRouter);
app.use("/api/productTypes", productTypeRouter);
app.use("/api/productCategories", productCategoriesRouter);
app.use("/api/productDetails", productDetailsRouter);
app.use("/api/similarProducts", similarProductsRouter);
app.use("/api/review", reviewRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/shoppingCart", shoppingCartRouter);
app.use("/api/dashBoardImages", dashBoardImagesRouter);
app.use("/api/order", orderRouter);
app.use("/api/tracking", trackingPartnerRouter);

//error for missing route
app.use((req, res, next) => {
  throw new HttpError("Could not find the route", 404);
});

//common error
app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json({ success: false, message: error.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;

// server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

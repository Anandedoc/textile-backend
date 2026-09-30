/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");

//Create Main Model

const Product = db.products;

//1.Add Product

const addProduct = async (req, res) => {
  let info = {
    name: req.body.name,
    createdBy: 1,
  };

  try {
    await Product.create(info);
    res
      .status(200)
      .json({ success: true, message: "Product Created Successfully" });
  } catch (error) {
    console.log(error);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

//2.Get All Products

// const getAllProducts = async ( req, res ) => {

//     const allProducts = await Product.find({});
//     res.status(200).send('Success');
// }

//3.Get Single Product

const singleProduct = async (req, res) => {
  let id = req.params.id;

  try {
    let product = await Product.findOne({ where: { id } });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

//4.Update Product

const updateProduct = async (req, res) => {
  let id = req.params.id;
  
  try {
    await Product.update(req.body, { where: { id } });
    res
      .status(200)
      .json({ success: true, message: "Product Updated Successfully" });
  } catch(error) {
    console.log(error);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

// 5.Delete Product

const deleteProduct = async (req, res) => {
  let id = req.params.id;
  try {
    await Product.destroy({ where: { id } });
    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch(error) {
    console.log(error);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

module.exports = {
  addProduct,
  singleProduct,
  updateProduct,
  deleteProduct,
};

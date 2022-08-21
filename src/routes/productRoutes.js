import express from "express";
import {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} from "../controllers/productsController.js";
import { isAuthorizedRole, isUserAuthenticated } from "../middlewares/auth.js";
const productRoutes = express.Router();

// get all products
productRoutes.get("/", getAllProducts);

// product details
productRoutes.get("/product/:id", getProductDetails);

// create new product --admin
productRoutes.post(
  "/admin/add",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  createProduct
);

// edit product --admin
productRoutes.put(
  "/admin/edit/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  editProduct
);

// delete product --admin
productRoutes.delete(
  "/admin/delete/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  deleteProduct
);

// add review
productRoutes.put("/reviews", isUserAuthenticated, createProductReview);
productRoutes.get("/reviews", isUserAuthenticated, getProductReviews);
productRoutes.delete(
  "/reviews",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  deleteReview
);

export default productRoutes;

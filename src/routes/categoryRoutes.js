import Express from "express";
import {
  addCategory,
  getAllCategories,
  getActiveCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAuthorizedRole, isUserAuthenticated } from "../middlewares/auth.js";
const categoryRoutes = Express.Router();

// add
categoryRoutes.post(
  "/add",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  addCategory
);

// all --admin
categoryRoutes.get(
  "/all",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  getAllCategories
);

// active category --client
categoryRoutes.get("/active", isUserAuthenticated, getActiveCategories);

// update category --admin
categoryRoutes.put(
  "/update/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  updateCategory
);

// delete
categoryRoutes.delete(
  "/delete/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  deleteCategory
);

export default categoryRoutes;

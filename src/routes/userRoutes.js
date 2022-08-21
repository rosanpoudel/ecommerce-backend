import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getResetPasswordToken,
  resetPassword,
  getUserDetails,
  changePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { isUserAuthenticated, isAuthorizedRole } from "../middlewares/auth.js";
const userRoutes = express.Router();

userRoutes.post("/signup", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/logout", logoutUser);
userRoutes.post("/forgot-password", getResetPasswordToken);
userRoutes.put("/reset-password/:token", resetPassword);
userRoutes.get("/me", isUserAuthenticated, getUserDetails);
userRoutes.put("/change-password", isUserAuthenticated, changePassword);
userRoutes.put("/update-profile", isUserAuthenticated, updateProfile);

// get all users --admin
userRoutes.get(
  "/admin/all-users",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  getAllUsers
);

// get single user --admin
userRoutes.get(
  "/admin/user/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  getSingleUser
);

// update user --admin
userRoutes.put(
  "/admin/user/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  updateUser
);

// delete user --admin
userRoutes.delete(
  "/admin/user/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  deleteUser
);

export default userRoutes;

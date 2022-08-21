import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import CustomError from "../utils/errorHandler.js";

export const isUserAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new CustomError("Please login to access the resource", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);
  req.user = await UserModel.findById(decoded.userId);
  next();
};

export const isAuthorizedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          `Resources cannot be accesed by Role: ${req.user.role}`,
          401
        )
      );
    }
    next();
  };
};

import Express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/ordersController.js";
import { isAuthorizedRole, isUserAuthenticated } from "../middlewares/auth.js";
const orderRoutes = Express.Router();

// create order
orderRoutes.post("/create", isUserAuthenticated, createOrder);

//  get all orders --admin
orderRoutes.get(
  "/all",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  getAllOrders
);

//  get my orders
orderRoutes.get("/order/my", isUserAuthenticated, getMyOrders);

//  get single orders
orderRoutes.get("/order/:id", isUserAuthenticated, getSingleOrder);

//  update order status  --admin
orderRoutes.put(
  "/order/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  updateOrderStatus
);

//  delete order  --admin
orderRoutes.delete(
  "/order/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  deleteOrder
);

export default orderRoutes;

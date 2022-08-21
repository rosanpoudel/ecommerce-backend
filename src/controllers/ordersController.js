import OrderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import CustomError from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

// create order
export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await OrderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  if (!order) {
    return next(new CustomError("Failed to create order", 400));
  }

  res.status(200).json({ success: true, order });
});

// get all orders --admin
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await OrderModel.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({ success: true, totalAmount, orders });
});

// get my orders
export const getMyOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await OrderModel.find({ user: req.user.id });
  if (!orders) {
    return next(new CustomError("Failed to get orders", 400));
  }

  res.status(200).json({ success: true, orders });
});

// get single order
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new CustomError("Order not found with that id", 400));
  }

  res.status(200).json({ success: true, order });
});

// update order --admin
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    return next(new CustomError("Order not found with that id", 400));
  }

  // if already delivered
  if (order.orderStatus === "Delivered") {
    return next(new CustomError("Order already delivered", 404));
  }

  // decrease from product stock when item delivered
  order.orderItems.forEach(async (o) => {
    const product = await ProductModel.findById(o.product);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  });

  // updating order status
  order.orderStatus = req.body.orderStatus;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({ status: true });
});

// delete order --admin
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new CustomError("Order not found with that id", 400));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

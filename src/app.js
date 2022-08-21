import express from "express";
import connectDatabase from "./config/database.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
// ROUTES IMPORT
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import dotenv from "dotenv";
import HandleError from "./middlewares/apiErrors.js";

dotenv.config();
const app = express();

// handle uncaught exception
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

// request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
const port = process.env.PORT || 4000;

// CONNECT DATABASE
connectDatabase();

// START SERVER
const server = app.listen(port, () => {
  console.log(`server is running on :${port}`);
});

// unhandeled promise rjection
process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});

// ROUTES
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/banners", bannerRoutes);
app.use("/category", categoryRoutes);

// ERROR HANDLER
app.use(HandleError);

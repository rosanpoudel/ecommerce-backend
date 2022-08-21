import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .catch((err) => console.log("mongo db connection error:", err.message));
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("mongo db connected successfully");
  });
};

export default connectDatabase;

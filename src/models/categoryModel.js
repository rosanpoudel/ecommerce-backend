import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;

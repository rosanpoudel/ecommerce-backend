import CategoryModel from "../models/categoryModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import CustomError from "../utils/errorHandler.js";

// add categoy
export const addCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await CategoryModel.create(req.body);
  if (!category) {
    return next(CustomError("Failed to create category", 500));
  }

  res.status(200).json({ success: true, category });
});

// all categories
export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await CategoryModel.find();

  if (!categories) {
    return next(CustomError("Failed to fetch categories", 500));
  }

  res.status(200).json({ success: true, categories });
});

// get active category
export const getActiveCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await CategoryModel.find({ active: true });
  if (!categories) {
    return next(CustomError("Failed to fetch categories", 500));
  }

  res.status(200).json({ success: true, categories });
});

// update category name/active status
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  let category = await CategoryModel.findById(req.params.id);

  if (!category) {
    return next(CustomError("Category not found with that id", 500));
  }

  category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!category) {
    return next(new CustomError("Failed to update", 500));
  }

  res.status(200).json({ success: true, category });
});

// deletecategory
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id);
  if (!category) {
    return next(CustomError("Failed to fetch categories", 500));
  }

  await category.remove();

  res.status(200).json({ success: true });
});

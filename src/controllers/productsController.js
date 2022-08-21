import ProductModel from "../models/productModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import CustomError from "../utils/errorHandler.js";

// create product --admin
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const newProduct = await ProductModel.create(req.body);

  if (!newProduct) {
    return next(new CustomError("Failed to add product", 400));
  }
  return res.status(200).json({ success: true, product: newProduct });
});

// get all products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const apiFeature = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const productsCount = await ProductModel.countDocuments();
  const products = await apiFeature.query;

  // total pages
  const pageCount = productsCount / resultPerPage;
  const totalPages =
    pageCount % 1 !== 0 ? pageCount - (pageCount % 1) + 1 : pageCount;
  const currentPage = req.query.page ? Number(req.query.page) : 1;

  // api response
  res
    .status(200)
    .json({ success: true, products, productsCount, totalPages, currentPage });
});

// get product details
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  product.view += 1;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, product });
});

// edit product --admin
export const editProduct = catchAsyncErrors(async (req, res, next) => {
  let product = ProductModel.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 400));
  }

  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully !",
    product,
  });
});

// delete product --admin
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = ProductModel.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 400));
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully !",
  });
});

// add/update reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await ProductModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
  }

  product.totalReviews = product.reviews.length;

  let avgRating = 0;
  product.reviews?.forEach((rev) => {
    avgRating += rev.rating;
  });

  product.ratings = avgRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

// get all reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);

  if (!product) {
    return next(new CustomError("Product not found with that id", 400));
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});

// delete reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);

  if (!product) {
    return next(new CustomError("Product not found with that id", 400));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const totalReviews = reviews.length;

  await ProductModel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      totalReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({ success: true });
});

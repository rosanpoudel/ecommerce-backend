import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import BannerModel from "../models/bannerModel.js";
import CustomError from "../utils/errorHandler.js";

// add banner
export const addBanner = catchAsyncErrors(async (req, res, next) => {
  const banner = await BannerModel.create(req.body);

  if (!banner) {
    return next(new CustomError("Banner cannot be added", 500));
  }

  res.status(200).json({ success: true, banner });
});

// get all banner
export const getAllBanners = catchAsyncErrors(async (req, res, next) => {
  const banners = await BannerModel.find();

  if (!banners) {
    return next(new CustomError("Failed to fetch banners", 400));
  }

  res.status(200).json({ success: true, banners });
});

// delete banner
export const deleteBanner = catchAsyncErrors(async (req, res, next) => {
  const banner = await BannerModel.findById(req.params.id);

  if (!banner) {
    return next(new CustomError("Banner not found with that id", 500));
  }

  await banner.remove();

  res.status(200).json({ success: true });
});

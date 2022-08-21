import Express from "express";
import { isUserAuthenticated, isAuthorizedRole } from "../middlewares/auth.js";
import {
  addBanner,
  deleteBanner,
  getAllBanners,
} from "../controllers/bannerController.js";

const bannerRoutes = Express.Router();

bannerRoutes.post(
  "/add",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  addBanner
);

bannerRoutes.get(
  "/all",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  getAllBanners
);

bannerRoutes.delete(
  "/:id",
  isUserAuthenticated,
  isAuthorizedRole("admin"),
  deleteBanner
);

export default bannerRoutes;

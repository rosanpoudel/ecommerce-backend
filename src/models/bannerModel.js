import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const BannerModel = mongoose.model("Banner", bannerSchema);

export default BannerModel;

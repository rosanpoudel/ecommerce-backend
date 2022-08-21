import jwt from "jsonwebtoken";
import crypto from "crypto";

// create JWT TOKEN
export const createJwtToken = async (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

// send token to user after signup/login success
export const sendTokenToUser = async (user, res) => {
  const token = await createJwtToken(user._id);
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, user, token });
};

// reset password token
export const generateResetPasswordToken = () => {
  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing
  const newToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  return newToken;
};

import {
  generateResetPasswordToken,
  sendTokenToUser,
} from "../utils/jwtToken.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendEmail from "../utils/sendEmail.js";
import CustomError from "../utils/errorHandler.js";

// signup
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "sample id",
      url: "sample url",
    },
  });

  if (!user) {
    return next(new CustomError("Failed to create user", 500));
  }

  //   signup success
  sendTokenToUser(user, res);
});

// login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //  check if email/password is provided or not
  if (!email || !password) {
    return next(new CustomError("Please provide username or password", 400));
  }

  //   check if email exists or not
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("Invalid email or password", 400));
  }

  // check if password matched or not
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new CustomError("Invalid email or password", 400));
  }

  //   login success
  sendTokenToUser(user, res);
});

// logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// reset password token
export const getResetPasswordToken = catchAsyncErrors(
  async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: false, message: "User not found" });
    }

    // get reset password token
    const resetToken = generateResetPasswordToken();

    // RESET PASSWORD URL
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/users/reset-password/${resetToken}`;

    const message = `Your reset password token is : \n ${resetPasswordUrl} \n If you have not requested it then please ignore it.`;
    console.log("reset url in mail:", message);
    try {
      // send email
      await sendEmail({
        email: user.email,
        subject: "Ecommerce password recovery",
        message,
      });

      // updating token in database
      user.resetPasswordToken = resetToken;
      user.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
      await UserModel.findByIdAndUpdate(user.id, user, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        status: true,
        message: `Email sent to ${user.email} successfully`,
        resetUrl: resetPasswordUrl,
      });
    } catch (error) {
      // set to undefined incase of error
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await UserModel.findByIdAndUpdate(user.id, user, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      return next(new CustomError(error.message, 500));
    }
  }
);

// reset password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash

  const user = await UserModel.findOne({
    resetPasswordToken: req.params.token,
  });

  if (!user) {
    return next(new CustomError("Token invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password does not match", 400)
    );
  }

  const hashNewPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashNewPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // relogin after password change
  sendTokenToUser(user, res);
});

// get user details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);

  return res.status(200).json({ success: true, user });
});

// change passwords
export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id).select("+password");

  // compare old password and db password
  const isPasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    return next(
      new CustomError("Password does not match with previous password", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password does not match", 400)
    );
  }

  // if old password match
  const hashedNewPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedNewPassword;
  await user.save({ validateBeforeSave: false });

  // relogin after password update
  sendTokenToUser(user, res);
});

// update profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  const updateUser = await UserModel.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!updateUser) {
    return res
      .status(500)
      .json({ success: true, message: "Failed to update profile" });
  }

  return res
    .status(200)
    .json({ success: true, message: "Profile updated successfully !" });
});

// get all users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await UserModel.find();

  if (!users) {
    return next(new CustomError("Failed to get all users", 500));
  }

  res.status(200).json({ success: true, users });
});

// get single user
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  res.status(200).json({ success: true, user });
});

// update user
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
  };

  const user = await UserModel.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new CustomError("Failed to update user", 400));
  }

  res.status(200).status(200).json({ success: true, user });
});

// update user
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new CustomError("User not found with that id", 400));
  }

  await user.remove();

  res.status(200).json({ success: true, message: "User deleted successfully" });
});

import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = "/profile_images";

//* register
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //* body
    const { full_name, email, password, phone } = req.body;
    const file = req.file;
    console.log(file);

    if (!full_name) {
      throw new AppError("full_name is required", 400);
    }
    if (!email) throw new AppError("email is required", 400);

    if (!password) {
      throw new AppError("password is required", 400);
    }

    const user = new User({ email, full_name, phone });

    //* hash password
    const hashPass = await hashPassword(password);
    user.password = hashPass;
    //* handle profile image upload
    if (file) {
      //* upload to cloudinary
      const { path, public_id } = await upload(file, uploadFolder);

      //profile_image = {path:'',public_id:''}
      // profile_image = ''

      user.profile_image = {
        path,
        public_id,
      };
    }

    //! save user
    await user.save();

    //* success response
    res.status(201).json({
      message: "Account created",
      success: true,
      status: "success",
      data: user,
    });
  },
);

//* login
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // email , password
    const { email, password } = req.body;

    if (!email) {
      throw new AppError("email is required", 400);
    }

    if (!password) {
      throw new AppError("password is required", 400);
    }

    //* find user by email
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      throw new AppError("credentials does not matched", 400);
    }

    //* compare password
    const isPassMatched = await comparePassword(password, user.password);

    if (!isPassMatched) {
      throw new AppError("credentials does not matched", 400);
    }

    //todo: generate jwt token

    //* send success response
    res.status(201).json({
      message: "Login success",
      status: "success",
      success: true,
      data: user,
    });
  },
);

//* get profile

//* change password

//* forgot password

//* change email
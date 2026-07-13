import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import { IJwtPayload } from "../types/global.types";
import ENV_CONFIG from "../config/env.config";
import { sendResponse } from "../utils/sendResponse.utils";

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

    //* converting mongoose doc to js object
    const { password: user_pass, ...rest } = user.toObject();

    //* success response
    sendResponse(res, {
      message: "Account created",
      statusCode: 201,
      data: rest,
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
    const payload: IJwtPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const access_token = generateJwtToken(payload);

    res.cookie("access_token", access_token, {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
    });

    const { password: p, ...rest } = user.toObject();
    //* send success response
    sendResponse(res, {
      message: "Login success",
      statusCode: 201,
      data: {
        user: rest,
        access_token,
      },
    });
  },
);

//* logout

//* get profile

//* change profile image
export const changeProfileImage = catchAsync(
  async (req: Request, res: Response) => {
    const { _id } = req.user;
    const file = req.file;
    if (!file) {
      throw new AppError("profile image is required", 400);
    }
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new AppError("Profile not found", 400);
    }

    //! delete old image
    if (user.profile_image && user.profile_image?.public_id) {
      await deleteFile(user.profile_image.public_id);
    }

    const { path, public_id } = await upload(file, uploadFolder);
    user.profile_image = {
      path,
      public_id,
    };

    //* send success response
    sendResponse(res, {
      message: "Profile updated",
      statusCode: 200,
      data: user,
    });
  },
);

//* change password

//* forgot password

//* change email
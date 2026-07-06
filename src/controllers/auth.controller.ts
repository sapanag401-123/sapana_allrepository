import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import {hashPassword, comparePassword} from "../utils/bcrypt.utils";
import appError from "../utils/appError.utils";

// Register
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
        const { full_name, email, password, phone_number } = req.body;

        if (!full_name) {
            throw new appError("full_name is required", 400);
        }

        if (!email) {
            throw new appError("email is required", 400);
        }

        if (!password) {
            throw new appError("password is required", 400);
        }

        const user = new User({
            full_name,
            email,
            phone_number,
        });

        // Hash password
        const hashPass = await hashPassword(password);
        user.password = hashPass;

        // Save user
        await user.save();

        // Success response
        res.status(201).json({
            message: "Account created",
            success: true,
            status: "success",
            data: user,
        });

};

//login
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {  email, password } = req.body;


        if (!email) {
            throw new appError("email is required", 400);
        }

        if (!password) {
            throw new appError("password is required", 400);
        }




       //find user by email
       const user = await User.findOne({email:email}).select("+password");
       if (!user){
        throw new appError("credentials does not match", 400);
       }
       //* compare password
        const isPasswordMatch = await comparePassword(password, user.password);
        if(!isPasswordMatch){
            throw new appError("credentials does not match", 400);
        };

        //todo: generate jwt token
    //send success response
       res.status(200).json({
        message: "login success",
        status: "success",
        success: true,
        data: user,
       });
        } catch (error) {
        next(error);
    }
};



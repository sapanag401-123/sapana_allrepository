import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/bcrypt.utils";
import appError from "../utils/app.Error.utils";

// Register
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
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
            password,
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
    } catch (error) {
        next(error);
    }
};
import { Request, Response } from "express";
import { Role } from "../types/enum.types";
import { NextFunction } from "express";

//* 1. login
//* 2. authorized ?

export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Authorization header  / cookies
      //* 1. get access_token
      //* 2. verify access token
      //* 3. check token expiry
      //* 4.check role
      next();
    } catch (error) {
      next(error);
    }
  };
};
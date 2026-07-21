import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types/global.types";
import ENV_CONFIG from "../config/env.config";
import { IJwtReturn } from "../types/global.types";


//* generate token
export const generateJwtToken = (payload: IJwtPayload) => {
  try {
    return jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
      expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any,
    });
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

//* verify jwt token
export const verifyJwtToken = (token: string): IJwtReturn=> {
  try {
    return jwt.verify(token, ENV_CONFIG.JWT_SECRET) as IJwtReturn;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
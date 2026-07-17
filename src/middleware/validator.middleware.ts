import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import AppError from "../utils/appError.utils";

export const validate = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    //! if error
    if (!result.success) {
      // ['body',''full_name]
      const errors = result.error.issues.map((issue) => {
        return {
          path: issue.path.join("."),
          message: issue.message,
        };
      });
      return next(new AppError("validation error", 400, errors));
    }

    //* if validation passed
    req.body = result.data.body;
    req.params = result.data.params as Record<string, any>;
    Object.assign(req.query, result.data.query);

    next();
  };
};

//brand 
//product
//category
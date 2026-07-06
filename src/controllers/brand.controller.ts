import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";

// Create Brand
export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  // req.file / files

  if (!name) {
    throw new appError("name required.", 400);
  }

  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    throw new appError("Brand already exists.", 400);
  }

  const brand = new Brand({
    name,
    description,
  });

  // * handle logo upload

  //* save brand
  await brand.save();

  res.status(201).json({
    success: true,
    message: "Brand created successfully.",
    data: brand,
  });
});

// Get All Brands
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.find();

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  },
);

// Get Brand By ID
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      throw new appError("Brand not found.", 404);
    }

    res.status(200).json({
      message: `brand by id:${req.params.id} fetched`,
      success: true,
      data: brand,
    });
  },
);

// Update Brand
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      data: brand,
    });
  },
);

// Delete Brand
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  },
);
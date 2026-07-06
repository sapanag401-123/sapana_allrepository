import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";

// Create Brand
export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, logo } = req.body;

    if (!name || !description || !logo) {
      return next(new appError("All fields are required.", 400));
    }

    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
      return next(new appError("Brand already exists.", 400));
    }

    const brand = await Brand.create({
      name,
      description,
      logo,
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully.",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Brands
export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await Brand.find();

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

// Get Brand By ID
export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

// Update Brand
export const updateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Brand
export const deleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return next(new appError("Brand not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
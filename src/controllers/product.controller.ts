import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";

// Create Product
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, category, price, stock } = req.body;

    if (!name) {
      throw new AppError("Name is required", 400);
    }

    if (!category) {
      throw new AppError("Category is required", 400);
    }

    if (price === undefined) {
      throw new AppError("Price is required", 400);
    }

    if (stock === undefined) {
      throw new AppError("Stock is required", 400);
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      throw new AppError("Product already exists", 409);
    }

    const product = await Product.create({
      name,
      category,
      price,
      stock,
    });

    res.status(201).json({
      success: true,
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  }
);

// Update Product
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        price,
        stock,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
);

// Get All Products
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      status: "success",
      message: "All products fetched",
      data: products,
    });
  }
);

// Get Product By ID
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Product fetched successfully",
      data: product,
    });
  }
);
// Delete Product
export const deleteproduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Product deleted successfully",
    });
  }
);

//* get by category

//* get by brand

//* get new arrivals

//* get featured
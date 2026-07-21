import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { getPagination } from "../utils/pagination.utils";

const uploadFolder = "/categories";
//* get all -> sapana
//* Get all categories
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      query,
      order = "DESC",
      sortBy = "createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const filter: Record<string, any> = {};

    if (query) {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    const categories = await Category.find(filter)
      .limit(perPage)
      .skip(skip)
      .sort({
        [sortBy as string]: order === "DESC" ? -1 : 1,
      });

    const totalCount = await Category.countDocuments(filter);

    sendResponse(res, {
      message: "Categories fetched successfully",
      data: {
        categories,
        pagination: getPagination({
          totalCount,
          perPage,
          currentPage,
        }),
      },
      statusCode: 200,
    });
  }
);

//* get by id -> rubina
//* Get category by ID
export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  }
);

//* create -> ashmita e
//* Create category
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const file = req.file;

    if (!name) throw new AppError("Name is required", 400);
    if (!file) throw new AppError("Logo is required", 400);

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new AppError("Category already exists", 400);
    }

    const { path, public_id } = await upload(file, uploadFolder);

    const category = new Category({
      name,
      description,
      logo: {
        path,
        public_id,
      },
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }
);

//* update -> atit
//* Update category
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      throw new AppError("Category does not exist", 404);
    }

    const updateData: any = {
      name,
      description,
    };

    // If new logo is uploaded
    if (file) {
      const { path, public_id } = await upload(file, uploadFolder);

      updateData.logo = {
        path,
        public_id,
      };
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  }
);

//* delete -> shristi 
//* Delete category
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null,
    });
  }
);
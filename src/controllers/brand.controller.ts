import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { getPagination } from "../utils/pagination.utils";


const uploadFolder = "/brands";

// Create Brand
export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  // req.file / files
    const file = req.file;


  if (!name) {
    throw new appError("name required.", 400);
  }

if (!file) {
    throw new appError("logo is required.", 400);
  }

  const existingBrand = await Brand.findOne({ name });

  if (existingBrand) {
    throw new appError("Brand already exists.", 400);
  }

  const brand = new Brand({
    name,
    description,
  });

  const { path, public_id } = await upload(file, uploadFolder);

  //profile_image = {path:'',public_id:''}
  // profile_image = ''

  brand.logo = {
    path,
    public_id,
  };

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
//total 100
//page 1 limit:10   skip:0  ->10  id 1-10
//page 2 limit:10  skip: 10 ->10  id 11-20
//page 3 limit:10  skip: 10 ->20  id 21-30
//page 4 limit:10  skip: 10 ->30  id 31-40

export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

   //filter
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

    if (query){
      // filter.name = {
        // $regex: query,
        // $options: "i",
        filter.$or = [
          {
            name: {
             $regex: query,
             $options: "i",

            },
          },
          {
            description:{
              $regex: query,
             $options: "i",
            },
          },
        ];
        }
    const brands = await Brand.find(filter)
    .limit(perPage)
    .skip(skip)
    .sort({
    [sortBy as string]: order === "DESC" ? -1 : 1,
    });

    const totalCount = await Brand.countDocuments(filter);

     sendResponse(res, {
      message: "Brands fetched",
      data: {
        brands,
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
// test

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
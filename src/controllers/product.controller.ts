import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import Category from "../models/category.model";
import Brand from "../models/brand.model";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { sendResponse } from "../utils/sendResponse.utils";

const folder = "/products";

//* get all
export const getAll = catchAsync(async (req, res) => {
  const products = await Product.find({});

  sendResponse(res, {
    data: products,
    message: "Products fetched",
    statusCode: 200,
  });
});
//* get by id
export const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });

  if (!product) throw new AppError(`product not found`, 404);

  sendResponse(res, {
    data: product,
    message: `Product:${id} fetched`,
    statusCode: 200,
  });
});

//* create
export const create = catchAsync(async (req, res) => {
  const { cover_image, images } = req.files as {
    cover_image: Express.Multer.File[];
    images: Express.Multer.File[];
  };
  const {
    name,
    description,
    price,
    brand,
    category,
    new_arrival,
    is_featured,
  } = req.body;

  if (!cover_image || !cover_image[0]) {
    throw new AppError("cover image is required", 400);
  }

  const product = new Product({
    name,
    description,
    price,
    brand,
    category,
    new_arrival,
    is_featured,
  });

  //* upload cover_image
  const { path, public_id } = await upload(cover_image[0], folder);
  product.cover_image = {
    path,
    public_id,
  };

  //Promise.all(arr_promise)
  //Promise.allSettled(arr_promise)
  //Promise.race(arr_promise)
  //Promise.any(arr_promise)

  //* upload images
  if (images && images.length > 0) {
    const promises = images.map((file) => upload(file, folder));
    const files = await Promise.allSettled(promises);
    const fullFilled = files
      .filter((promise) => promise.status === "fulfilled")
      .map((img) => img.value);
    product.set("images", fullFilled);
  }
  //* save product
  await product.save();

  //* send response
  sendResponse(res, {
    message: "product created",
    data: product,
    statusCode: 201,
  });
});

//* delete
export const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) throw new AppError(`product not found`, 404);

  //* delete cover image
  deleteFile(product.cover_image.public_id);

  //*delete images
  if (product.images && product.images.length > 0) {
    Promise.allSettled(product.images.map((img) => deleteFile(img.public_id)));
  }

  //* delete product
  await product.deleteOne();

  //* send response
  sendResponse(res, {
    message: `product: ${id} deleted`,
    statusCode: 200,
    data: null,
  });
});

//* update
// deleted_image = [public_ids]
// [5] => [3] + [2]

export const update = catchAsync(async (req, res) => {
  const { cover_image, images } = req.files as {
    cover_image: Express.Multer.File[];
    images: Express.Multer.File[];
  };
  const {
    name,
    description,
    price,
    brand,
    category,
    new_arrival,
    is_featured,
    deleted_images,
  } = req.body;

  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) throw new AppError(`product not found`, 404);

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (brand) product.brand = brand;
  if (price) product.price = price;
  if (new_arrival) product.new_arrival = new_arrival;
  if (is_featured) product.is_featured = is_featured;

  //* update cover image
  if (cover_image && cover_image[0]) {
    deleteFile(product.cover_image.public_id);
    const { path, public_id } = await upload(cover_image[0], folder);
    product.cover_image = {
      path,
      public_id,
    };
  }

  //* update images
  //* if deleted images
  if (
    deleted_images &&
    Array.isArray(deleted_images) &&
    deleted_images.length > 0
  ) {
    Promise.allSettled(
      deleted_images.map((public_id) => deleteFile(public_id)),
    );

    product.images = product.images.filter(
      (img) => !deleted_images.includes(img.public_id.toString()),
    ) as any;
  }

  //* if new images
  if (images && images.length > 0) {
    // [{status:'',value:{path,public_id}}]
    const files = await Promise.allSettled(
      images.map((file) => upload(file, folder)),
    );

    const newImages = files
      .filter((file) => file.status === "fulfilled")
      .map((file) => file.value);
    product.set("images", [...product.images, ...newImages]);
  }

  //* save product
  await product.save();

  //* send successful response
  sendResponse(res, {
    message: `product:${id} updated`,
    data: product,
    statusCode: 200,
  });
});


//* get by category
export const getByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    const products = await Product.find({
      category: categoryId,
    })
      .populate("category")
      .populate("brand");

    res.status(200).json({
      success: true,
      status: "success",
      message: "Products fetched successfully",
      total: products.length,
      data: products,
    });
  }
);

//* get by brand
export const getByBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { brandId } = req.params;

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return next(new AppError("Brand not found", 404));
    }

    const products = await Product.find({
      brand: brandId,
    })
      .populate("category")
      .populate("brand");

    res.status(200).json({
      success: true,
      status: "success",
      message: "Products fetched successfully",
      total: products.length,
      data: products,
    });
  }
);

//* get new arrivals
export const getNewArrivals = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({
      new_arrival: true,
    })
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status: "success",
      message: "New arrival products fetched successfully",
      total: products.length,
      data: products,
    });
  }
);

//* get featured
export const getFeaturedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({
      is_featured: true,
    })
      .populate("category")
      .populate("brand");

    res.status(200).json({
      success: true,
      status: "success",
      message: "Featured products fetched successfully",
      total: products.length,
      data: products,
    });
  }
);


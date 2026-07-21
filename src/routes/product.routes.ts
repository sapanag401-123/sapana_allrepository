import { Router } from "express";
import {
  create,
  getAll,
  getById,
  getFeaturedProducts,
  getNewArrivals,
  getByCategory,
  getByBrand,
} from "../controllers/product.controller";

import { authenticate } from "../middleware/auth.middleware";
import { uploader } from "../middleware/multer.middleware";
import { All_Admins } from "../types/enum.types";

const router = Router();
const upload = uploader();

// get all
router.get("/", getAll);

//getfeature
router.get("/featured", getFeaturedProducts);

//get newarrivals
router.get("/new-arrivals", getNewArrivals);

//get by category
router.get("/category/:categoryId", getByCategory);

//get by brand
router.get("/brand/:brandId", getByBrand);

//get by id
router.get("/:id", getById);

// Admin Routes
// router.post(
//   "/",
//   upload.fields([
//     {
//       name: "cover_image",
//       maxCount: 1,
//     },
//     {
//       name: "images",
//       maxCount: 5,
//     },
//   ]),
//   authenticate(All_Admins),
//   create,
// );

//* update
router.post(
  "/",
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  authenticate(All_Admins),
  create,
);
export default router;
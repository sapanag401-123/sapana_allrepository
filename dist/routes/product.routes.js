"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_middleware_1 = require("../middleware/multer.middleware");
const enum_types_1 = require("../types/enum.types");
const router = (0, express_1.Router)();
const upload = (0, multer_middleware_1.uploader)();
// get all
router.get("/", product_controller_1.getAll);
//getfeature
router.get("/featured", product_controller_1.getFeaturedProducts);
//get newarrivals
router.get("/new-arrivals", product_controller_1.getNewArrivals);
//get by category
router.get("/category/:categoryId", product_controller_1.getByCategory);
//get by brand
router.get("/brand/:brandId", product_controller_1.getByBrand);
//get by id
router.get("/:id", product_controller_1.getById);
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
router.post("/", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), (0, auth_middleware_1.authenticate)(enum_types_1.All_Admins), product_controller_1.create);
exports.default = router;

import express from "express";
import {
    create,
    getAll,
    getById,
    update,
    deleteproduct,
} from "../controllers/product.controller";
import { uploader } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { All_Admins } from "../types/enum.types";

const upload = uploader();

const router = express.Router();

// getAll
router.get("/", getAll);

// getById
router.get("/:id", getById);

// create
router.post("/", upload.single("logo"), authenticate(All_Admins), create);

// update
router.put("/:id", upload.single("logo"), authenticate(All_Admins), update);

// delete
router.delete("/:id", authenticate(All_Admins), deleteproduct);

export default router;
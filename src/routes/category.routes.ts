import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/category.controller";
import { uploader } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { All_Admins } from "../types/enum.types";

const router = express.Router();
const upload = uploader();

//* get all category
router.get("/", getAll);

//* get by id
router.get("/:id", getById);

//* create/post
router.post("/", upload.single("logo"), authenticate(All_Admins), create);

//* update/put
router.put("/:id", upload.single("logo"), authenticate(All_Admins), update);

//* delete
router.delete("/:id", authenticate(All_Admins), remove);

export default router;
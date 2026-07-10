import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/brand.controller";
import { uploader } from "../middleware/multer.middleware";
const upload = uploader();

const router = Router();

router.post("/",upload.single("logo"), create);

router.get("/", getAll);

router.get("/:id", getById);

router.put("/:id", upload.single("logo"), update);

router.delete ("/:id", remove);

export default router;
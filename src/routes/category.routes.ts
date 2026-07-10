import express from "express";
import {
     getAll, 
     create, 
     getById, 
     update, 
     remove } 
     from "../controllers/category.controller";
     import { uploader } from "../middleware/multer.middleware";

const upload = uploader();


const router = express.Router();

router.post("/",upload.single("logo"),  create);

router.get("/", getAll);

router.get("/:id", getById);

router.put("/:id",upload.single("logo"), update);

router.delete("/:id", remove);

export default router;
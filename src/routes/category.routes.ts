import express from "express";
import { getAll, create, getById, update, remove } from "../controllers/category.controller";

const router = express.Router();

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getById);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;
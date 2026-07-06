import express from "express";
import { getAll, getAllAdmins, getById } from "../controllers/user.controller";

const router = express.Router();

//* get all users
router.get("/", getAll);

//* get all admins
router.get("/admins", getAllAdmins);

//* get user by id
router.get("/:id", getById);

export default router;
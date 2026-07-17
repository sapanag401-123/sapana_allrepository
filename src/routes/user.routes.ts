import express from "express";
import { getAll, getAllAdmins, getById, deleteUser } from "../controllers/user.controller";

const router = express.Router();

//* get all users
router.get("/", getAll);

//* get all admins
router.get("/admins", getAllAdmins);

//* get user by id
router.get("/:id", getById);

//* delete user 
router.delete("/:id", deleteUser);

export default router;

// sapanag401_db_user
// lprrnc9U5DLSQfRO
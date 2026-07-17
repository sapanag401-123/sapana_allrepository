import express from "express";
import { uploader } from "../middleware/multer.middleware";
import {
  register,
  login,
  changeProfileImage,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validator.middleware";
import { registerUserSchema } from "../validators/auth.validator";

const router = express.Router();

const upload = uploader();

//* register
router.post(
  "/register",
  upload.single("profile_image"),
  validate(registerUserSchema),
  register,
);

//* login
router.post("/login", login);

//* change profile image
router.put(
  "/profile-image",
  upload.single("profile_image"),
  authenticate(),
  changeProfileImage,
);

//* logout
// router.post('/logout' ,logout)

//* get profile
// router.get('/me', profile)

export default router;
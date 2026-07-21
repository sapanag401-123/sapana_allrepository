"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_middleware_1 = require("../middleware/multer.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validator_middleware_1 = require("../middleware/validator.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploader)();
//* register
router.post("/register", upload.single("profile_image"), (0, validator_middleware_1.validate)(auth_validator_1.registerUserSchema), auth_controller_1.register);
//* login
router.post("/login", auth_controller_1.login);
//* change profile image
router.put("/profile-image", upload.single("profile_image"), (0, auth_middleware_1.authenticate)(), auth_controller_1.changeProfileImage);
//* logout
// router.post('/logout' ,logout)
//* get profile
// router.get('/me', profile)
exports.default = router;

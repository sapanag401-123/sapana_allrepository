import express from "express";
import { uploader } from "../middleware/multer.middleware";
import { register , login} from "../controllers/auth.controller";


const router = express.Router();

const upload = uploader();

// //multer disk sthorage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         const folder = "uploads/";
//         cb(null, folder);
//     },
//     filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   },
// });



//multer upload instance
// const upload = multer({ dest: 'uploads/' })
// const upload = multer({ storage: storage })





//* register
router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", login);

export default router;

//filename vana ko change harna folder
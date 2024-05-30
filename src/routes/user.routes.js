import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multerFileUpload.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),   
    userRegister
)

export default router
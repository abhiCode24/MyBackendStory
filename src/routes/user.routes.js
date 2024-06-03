import { Router } from "express";
import { loginUser, logoutUser, userRegister } from "../controllers/user.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multerFileUpload.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

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

router.route('/login').post(loginUser)

//My secured Routes

router.route('/logout').post(verifyUser, logoutUser)

export default router
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const userRegister = asyncHandler(async (req,res,next) => {
    // take the data from the frontend
    // check validation on the data - not empty
    // check user is already exist or not - username, email
    // check for files in local server(images,avatar)
    // upload them on cloudinary , one check on avatar
    // create user object - create entry in db
    // remove password and refresh token field from response 
    // check user creation 
    // return response
    


    // take the data from the frontend
    const {userName,password,fullName,email} = req.body

    // check validation on the data - not empty
    if(userName === ""){
        throw new ApiError(401, "username is required");
    }

    if(email === "" || !email.includes('@')){
        throw new ApiError(401, "email should be in proper format");
    }

    if(password === ""){
        throw new ApiError(401, "password is required");
    }

    if(fullName === ""){
        throw new ApiError(401, "fullName is required");
    }

    // if ([userName,password,fullName,email].some((info)=> info?.trim() === "" )) {
    //     throw new ApiError(401, "All fields is required");
    // }


    // check user is already exist or not - username, email

    const existedUserName = await User.findOne({userName})
    const existedEmail = await User.findOne({email})

    if (existedEmail || existedUserName) {
        throw new ApiError(401, "Plzz use diffrent username and email")
    }
    
    // const existedUser = await User.findOne({
    //     $or:[{userName},{email}]
    // })

    // if(existedUser){
    //     throw new ApiError(401, "Plzz use diffrent username and email")
    // }

    // check for files in local server(images,avatar)

    // --> just like (req.body),(req.params) ese hi multer ki vajha se hume (req.files) milta h
    const avatarLocalPath = req.files?.avatar[0]?.path
    const imageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(409, "avatar is required");
    }

    // upload them on cloudinary , one check on avatar

    const avatarCloudUpload = await uploadOnCloudinary(avatarLocalPath)
    const imageCloudUpload = await uploadOnCloudinary(imageLocalPath)

    if (!avatarCloudUpload) {
       throw new ApiError(400, "Avatar is required") 
    }

    // create user object - create entry in db

    const newUser = await User.create({
        userName: userName.toLowercase(),
        fullName,
        password,
        avatar: avatarCloudUpload.url,
        coverImage: imageCloudUpload?.url || "",
        email
    })

    // remove password and refresh token field from response
    const user = await User.findById(newUser._id).select("-password -refreshToken")

    // check user creation 
    if (!newUser) {
        throw new ApiError(500, "user is not registered!!")
    }

    // return response
    return res.Status(200).json(
        new ApiResponse(200, user, "user registered successfully!!" )
    )
})

export {userRegister}
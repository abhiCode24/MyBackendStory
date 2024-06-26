import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { MyApiResponse } from "../utils/apiResponse.js";
import { jwt } from "jsonwebtoken";

const generateRefreshAndAccessToken = async(userId) => {
    try {
       const user = await User.findById({userId})
       const AccessToken = user.generateAccessToken()
       const RefreshToken = user.generateRefreshToken()
       user.refreshToken = RefreshToken

       await user.save({validateBeforeSave:false})

       return {AccessToken, RefreshToken}

    } 
    catch (error) {
        throw new ApiError(500, "SomeThing went wrong while generating access and refresh token")
    }
}


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
    const {username,password,fullName,email} = req.body

    // check validation on the data - not empty
    if(username === ""){
        throw new ApiError(401, "username is required");
    }

    if(email === ""){
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

    const existedUserName = await User.findOne({username})
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
    console.log(req.files)
    const avatarLocalPath =  req.files?.avatar[0]?.path; 
    const imageLocalPath =  req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    
    if (!avatarLocalPath) {
        throw new ApiError(401, "avatar is required");
    }

    // upload them on cloudinary , one check on avatar

    const avatarCloudUpload = await uploadOnCloudinary(avatarLocalPath)
    const imageCloudUpload = await uploadOnCloudinary(imageLocalPath)
    // console.log(avatarCloudUpload)

    if (!avatarCloudUpload) {
       throw new ApiError(400, "Avatar is required for cloudinary") 
    }

    // create user object - create entry in db

    const newUser = await User.create({
        username,
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
        new MyApiResponse(200, user, "user registered successfully!!" )
    )
})


const loginUser = asyncHandler(async(req,res,next)=>{
    // took data from the frontend part- req.body
    // validate the data through email aur username-not empty
    // check the user is exist in database or not
    // Then check for password 
    // give that user access aur refresh token
    // send response in cookies

    const {username,password,email} = req.body

    if(email === "" || username === ""){
         throw new ApiError(401, "All fields is required")
    }

    // const existedUserEmail = await User.findOne({email});
    // const existedUsername = await User.findOne({username});

    const user = await User.findOne({
        $or:[{username},{email}]        // this is an instance of our database...ki yrr haa ye hamare database mai h
    })

    if (!user){
        throw new ApiError(404, "User not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)  // here we use small user -> jo return hua h hamare DB se uska instance, bigger User hum jb use krte h jab database se baat krni ho kyuki model big vaale se banaya h 

    if (!isPasswordCorrect) {
        throw new ApiError(401, "password is incorrect");
    }

    const {AccessToken,RefreshToken} = await generateRefreshAndAccessToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -RefreshToken")

    const options = {
        httpOnly:true,      // This helps us ki koi bhi frontend se cookies ko ched nahi payega server se hi changes honge
        secure:true
    }

   return  res.status(200)
    .cookie("AccessToken", AccessToken, options)
    .cookie("RefreshToken", RefreshToken, options)
    .json(new MyApiResponse(
        200,
        {user: AccessToken,RefreshToken,loggedUser},
        "User Logged in successfully"
    ))

})

const logoutUser = asyncHandler(async(req,res)=>{
    // WHAT WE CANNOT DO
    // So kese logout kr skte h socho DB mai agr direct jaaye toh kis bases pr search maare sochoo
    // id->No because koi instance nahi h DB ka , User.findOne() bhi nahi lga skte kyuki excess hi nahi h kisi chiz ka

    // WHAT WE CAN DO
    // hum logged in user ki cookies ko hata skte h esa esa kuch kr skte h so kyu na ek middleware bana de
    // jo hamare req ko access dede user ka token ki madad se so lets see...
    // yeh middleware help krega user ko verify krne ke liye uske tokens se and then usse hume _id ka access and then vaha se DB ka access

    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken: undefined}
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("AccessToken",options)
    .clearCookie("RefreshToken",options)
    .json(new MyApiResponse(200, {}, "Logged Out User"))
})

const generateRefreshToken = asyncHandler(async()=>{
    // kyuki user ka access token expire ho gya h so
    // usko refresh krvane ke liye vo apna refresh token bhejga jo ki db mai store hota h 
    // so cookies se hum le lenge
    // then decode krlenge jwt se ki jo aya h aur jo backend mai save h dono same h ki nahi
    // fr jab mil gya then hume vaha se _id ka access mil jaega toh vaha se user ka instance mil jaega
    // then check jo frontend se refresh token aaya aur jo uss particular user ka refresh token agr barabar nahi h toh error
    // then newRefresh token generate krlo upr jo fn banaya tha usse 
    // and then cookie mai data bhej do fr se

    const userSendingRefreshToken = await req.cookie.refreshToken || req.body.refreshToken

    if (!userSendingRefreshToken) {
        throw new ApiError(401, "Invalid token")
    }

    const decoded = await jwt.verify(userSendingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decoded._id)

    if(!user){
        throw new ApiError(401, "Invalid refresh token")
    }

    if (userSendingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid refresh token")
    }

    const {AccessToken, newRefreshToken} = await generateRefreshAndAccessToken(user._id)
    
    const options = {
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .cookie("AccessToken", AccessToken, options)
    .cookie("RefreshToken", newRefreshToken,options)
    .json(
        new MyApiResponse(200,
            {
                AccessToken,
                RefreshToken:newRefreshToken
            },
            "Accessed Token Refreshed"

        )
    )
})

export {userRegister, loginUser, logoutUser,generateRefreshToken}

import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import {jwt} from "jsonwebtoken"

export const verifyUser = asyncHandler(async(req,res,next)=>{
   try {
    const userToken = await req.cookie?.AccessToken
 
    if (!userToken) {
         throw new ApiError(401, "request is unotherized")
    }
 
    const decodedUserToken = jwt.verify(userToken,process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedUserToken?._id).select("-password -refreshToken")
 
    if (!user) {
     throw new ApiError(402, "invalid access token")
    }
 
    req.user = user
    next()
   } catch (error) {
    throw new ApiError(401, "invalid access token")
   }
})
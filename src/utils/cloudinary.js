import {v2 as cloudinary} from 'cloudinary';
import { response } from 'express';
import fs from 'fs'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

// WRITING METHOD FOR UPLOADING FILE ON CLOUDINARY WHICH TOOKS LOCAL PATH AS A PARAMETER

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        // uploading the file on cloudinary
        else{
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto",
            })
            console.log("file uploaded successfully",response.url)
        }
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the locally saved temporarily file as the upload operation got failed
    }
}

export default uploadOnCloudinary;
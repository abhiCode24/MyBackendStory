import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async()=>{
    try {
        // const myDB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        const myDB = await mongoose.connect('mongodb+srv://sharmapratham143879:codingworld@backendlove.7btrygk.mongodb.net/mybackend')
        console.log(`Database connected successfully!! on DB HOST ${myDB.connection.host}`)
        
    } catch (error) {
        console.log('MongoDB connection error', error)
        process.exit(1)     // ye node.js provide krta h inbuilt
    }
}
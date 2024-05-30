import { connectDB } from "./db/index.js";
import { configDotenv } from "dotenv";
import {app} from './app.js'
configDotenv({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is connected to database!! On port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Error occur in Database', err)
})






/*
(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        
    } catch (error) {
        console.error('Error', error);
        throw error
    }
})()
*/
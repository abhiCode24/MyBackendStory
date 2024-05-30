import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,        // this is for connection between backend and frontend and ye batane ke
    credentials: true                       // liye ki kis kis origin ke frontend ke url se request aa skti h
}))

app.use(cookieParser())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("Public"))

//route import 
import userRouter from './routes/user.routes.js'

// route declaration
app.use('/api/v1/users', userRouter)  //  --> this [ /api/v1/users ] is set as prefix in our route fr yaha se control bhej dia aage userRoute se

// http://localhost:8000/api/v1/users/register

export {app}
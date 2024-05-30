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



export {app}
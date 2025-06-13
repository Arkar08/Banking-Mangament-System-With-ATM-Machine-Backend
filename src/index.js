import express from 'express';
import dotenv from 'dotenv';
import UserRoute from './routes/userRoute.js';
import AuthRoute from './routes/authRoute.js';
import BranchRoute from './routes/branchRoute.js';
import AccountRoute from './routes/accountRoute.js';
import TransactionRoute from './routes/transactionRoute.js';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from './middleware/authMiddleware.js';

dotenv.config();

const app = express()

cloudinary.config({ 
        cloud_name:process.env.cloudinary_name, 
        api_key: process.env.cloudinary_key, 
        api_secret:process.env.cloudinary_secret
    });

app.use(express.json())

app.use(cors())

app.get('/',(req,res)=> {
    return res.status(200).json("Hello World")
})


// routes

app.use("/api/v1/auth",AuthRoute)
app.use("/api/v1/user",authMiddleware,UserRoute)
app.use("/api/v1/branch",authMiddleware,BranchRoute)
app.use("/api/v1/account",authMiddleware,AccountRoute)
app.use("/api/v1/transaction",authMiddleware,TransactionRoute)

export default app;
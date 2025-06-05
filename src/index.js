import express from 'express';
import dotenv from 'dotenv';
import UserRoute from './routes/userRoute.js';
import AuthRoute from './routes/authRoute.js';
import BranchRoute from './routes/branchRoute.js';
import AccountRoute from './routes/accountRoute.js';
import TransactionRoute from './routes/transactionRoute.js';
import cors from 'cors';

dotenv.config();

const app = express()

app.use(express.json())

app.use(cors())

app.get('/',(req,res)=> {
    return res.status(200).json("Hello World")
})


// routes

app.use("/api/v1/auth",AuthRoute)
app.use("/api/v1/user",UserRoute)
app.use("/api/v1/branch",BranchRoute)
app.use("/api/v1/account",AccountRoute)
app.use("/api/v1/transaction",TransactionRoute)

export default app;
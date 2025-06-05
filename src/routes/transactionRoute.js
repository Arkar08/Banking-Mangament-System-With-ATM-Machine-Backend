import express from 'express'
import { getTransaction,postTransaction } from '../controllers/transactionController.js';


const router =  express.Router()

router.get("/",getTransaction)
router.post("/",postTransaction)

export default router;
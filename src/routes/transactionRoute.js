import express from 'express'
import { getTransactionController, postTransactionController } from '../controllers/transactionController.js';


const router =  express.Router()

router.get("/",getTransactionController)
router.post("/",postTransactionController)

export default router;
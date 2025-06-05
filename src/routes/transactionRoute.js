import express from 'express'
import { getTransaction,getUserTransaction,postTransaction } from '../controllers/transactionController.js';


const router =  express.Router()

router.get("/",getTransaction)
router.post("/",postTransaction)
router.get("/:userId",getUserTransaction)

export default router;
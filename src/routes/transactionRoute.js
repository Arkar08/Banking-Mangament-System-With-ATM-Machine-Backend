import express from 'express'
import { getTransaction,getUserTransaction,postPhoneNumber,postTransaction } from '../controllers/transactionController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';


const router =  express.Router()

router.get("/",authorizeAdmin,getTransaction)
router.post("/",postTransaction)
router.get("/:userId",getUserTransaction)
router.post("/:phoneNumber",postPhoneNumber)

export default router;
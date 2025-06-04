import express from 'express'
import { getAccountController, postAccountController } from '../controllers/accountController.js';


const router =  express.Router()

router.get("/",getAccountController)
router.post("/",postAccountController)

export default router;
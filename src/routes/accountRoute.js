import express from 'express'
import { getAccountController, getAccountIdController, postAccountController,patchAccountController, deleteAccountController} from '../controllers/accountController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';


const router =  express.Router()

router.get("/",authorizeAdmin,getAccountController)
router.post("/",authorizeAdmin,postAccountController)
router.get("/:id",getAccountIdController)
router.patch("/:id",patchAccountController)
router.delete("/:id",authorizeAdmin,deleteAccountController)

export default router;
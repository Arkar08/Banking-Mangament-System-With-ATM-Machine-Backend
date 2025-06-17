import express from 'express'
import { getAccountController, getAccountIdController, postAccountController,patchAccountController, deleteAccountController, getAccountNoController} from '../controllers/accountController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';


const router =  express.Router()

router.get("/",authorizeAdmin,getAccountController)
router.post("/",authorizeAdmin,postAccountController)
router.get("/:id",getAccountIdController)
router.put("/:id",patchAccountController)
router.delete("/:id",authorizeAdmin,deleteAccountController)
router.get("/find/:accountNo",getAccountNoController)

export default router;
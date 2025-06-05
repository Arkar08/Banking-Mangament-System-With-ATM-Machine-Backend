import express from 'express'
import { getAccountController, getAccountIdController, postAccountController,patchAccountController, deleteAccountController} from '../controllers/accountController.js';


const router =  express.Router()

router.get("/",getAccountController)
router.post("/",postAccountController)
router.get("/:id",getAccountIdController)
router.patch("/:id",patchAccountController)
router.delete("/:id",deleteAccountController)

export default router;
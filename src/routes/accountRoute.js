import express from 'express'
import { getAccountController, getAccountIdController, postAccountController,patchAccountController, deleteAccountController,withdraw,deposit,transfer } from '../controllers/accountController.js';


const router =  express.Router()

router.get("/",getAccountController)
router.post("/",postAccountController)
router.get("/:id",getAccountIdController)
router.patch("/:id",patchAccountController)
router.delete("/:id",deleteAccountController)
router.post("/withdraw",withdraw)
router.post("/deposit",deposit)
router.post("/transfer",transfer)

export default router;
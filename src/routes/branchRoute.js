import express from 'express'
import { deleteBranchController, getBranchController, getBranchIdController, patchBranchController, postBranchController } from '../controllers/branchController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';


const router =  express.Router()

router.get("/",authorizeAdmin,getBranchController)
router.post("/",authorizeAdmin,postBranchController)
router.get("/:id",authorizeAdmin,getBranchIdController)
router.put("/:id",authorizeAdmin,patchBranchController)
router.delete("/:id",authorizeAdmin,deleteBranchController)

export default router;
import express from 'express'
import { deleteBranchController, getBranchController, getBranchIdController, patchBranchController, postBranchController } from '../controllers/branchController.js';


const router =  express.Router()

router.get("/",getBranchController)
router.post("/",postBranchController)
router.get("/:id",getBranchIdController)
router.patch("/:id",patchBranchController)
router.delete("/:id",deleteBranchController)

export default router;
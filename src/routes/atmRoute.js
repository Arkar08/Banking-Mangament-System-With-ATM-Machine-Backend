import express from 'express'
import { deleteAtmController, getAtmController, getAtmIdController, patchAtmController, postAtmController } from '../controllers/atmController.js';


const router =  express.Router()

router.get("/",getAtmController)
router.post("/",postAtmController)
router.get("/:id",getAtmIdController)
router.patch("/:id",patchAtmController)
router.delete("/:id",deleteAtmController)

export default router;
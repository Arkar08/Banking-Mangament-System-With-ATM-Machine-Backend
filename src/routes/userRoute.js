import express from 'express'
import { deleteUserController, getUserController, getUserIdController, patchUserController, postUserController } from '../controllers/userController.js';


const router = express.Router()


router.get("/",getUserController)
router.post("/",postUserController)
router.get("/:id",getUserIdController)
router.patch("/:id",patchUserController)
router.delete("/:id",deleteUserController)

export default router;
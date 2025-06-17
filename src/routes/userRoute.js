import express from 'express'
import { deleteUserController, getUserController, getUserIdController, patchUserController, postUserController } from '../controllers/userController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';


const router = express.Router()


router.get("/",authorizeAdmin,getUserController)
router.post("/",authorizeAdmin,postUserController)
router.get("/:id",getUserIdController)
router.put("/:id",patchUserController)
router.delete("/:id",deleteUserController)

export default router;
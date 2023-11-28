import  express  from "express";
import { test, updatedUser } from "../controllers/user.controller.js";
import { verifyToken } from  '../utills/verifyUser.js'

const router = express.Router();

router.get('/', test)
router.post('/update/:id', verifyToken,updatedUser)

export default router
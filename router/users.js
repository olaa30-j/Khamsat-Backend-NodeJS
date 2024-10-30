import express from "express"
import {get, create, login, update, del, getProfile, getAll} from "../controller/users.js"
import upload from "../middleware/multer.config.js"
import { authenticateUser, checkRoles, verfiyToken } from "../middleware/auth.js"
const router = express.Router()

router.post("/login", login)
router.get("/profile", verfiyToken,  getProfile)
router.get("/:id", get)
router.get("/dashboard", authenticateUser, checkRoles('admin'), getAll)
router.post("/", create)
router.patch("/:id", verfiyToken, upload.single("avatar") ,update)
router.delete("/:id", verfiyToken, del)
export default router
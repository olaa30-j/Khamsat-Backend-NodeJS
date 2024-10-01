import express from "express"
import {get, getِAll, create, login, update, del, getProfile} from "../controller/users.js"
import upload from "../middleware/multer.config.js"
import { verfiyToken } from "../middleware/auth.js"
const router = express.Router()

router.post("/login", login)
router.get("/profile", verfiyToken,  getProfile)
router.get("/:id", get)
router.get("/", getِAll)
router.post("/", create)
router.patch("/:id", verfiyToken, upload.single("avatar") ,update)
router.delete("/:id", verfiyToken, del)
export default router
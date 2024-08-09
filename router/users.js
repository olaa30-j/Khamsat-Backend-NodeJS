import express from "express"
import {get, getِAll, create, login, update, del} from "../controller/users.js"
const router = express.Router()

router.post("/login", login)
router.get("/:id", get)
router.get("/", getِAll)
router.post("/", create)
router.patch("/:id", update)
router.delete("/:id", del)
export default router
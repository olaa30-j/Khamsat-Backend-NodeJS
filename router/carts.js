import express from "express"
import {get, addItem, delItem} from "../controller/carts.js"
const router = express.Router()

router.get("/", get)
router.post("/", addItem)
router.patch("/", delItem)
export default router
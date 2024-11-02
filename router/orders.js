import express from "express"
import {getAll, get, create, update, del, getOrdersByUser} from "../controller/orders.js"
import { verfiyToken } from "../middleware/auth.js"
const router = express.Router()

router.get("/", getAll)
router.get("/my-orders", verfiyToken, getOrdersByUser)
router.get("/:id", get)
router.post("/", create)
router.patch("/:id", update)
router.delete("/:id",del)

export default router
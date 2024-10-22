import express from "express"
import {getAll, get, create, update, del} from "../controller/orders.js"
const router = express.Router()

router.get("/", getAll)
router.get("/:id", get)
router.post("/", create)
router.patch("/:id", update)
router.delete("/:id",del)

export default router
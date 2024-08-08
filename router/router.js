import express from "express"
const router = express.Router()
import collections from "./collections.js"
import carts from "./carts.js"
import posts from "./posts.js"
import orders from "./orders.js"

router.use("/collections", collections)
router.use("/carts", carts)
router.use("/posts", posts)
router.use("/orders", orders)

export default router
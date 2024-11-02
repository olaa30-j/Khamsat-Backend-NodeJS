import express from "express"
import { createPaymentIntent, handleWebhook } from "../controller/payment.js"
import { verfiyToken } from "../middleware/auth.js"
const router = express.Router()

router.post("/create-payment-intent", verfiyToken, createPaymentIntent)
router.post("/webhook", handleWebhook)
export default router
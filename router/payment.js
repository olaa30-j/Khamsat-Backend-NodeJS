import express from "express"
import { createPaymentIntent, handleWebhook, handleCaptureOrder, handleCreateOrder } from "../controller/payment.js"
import { verfiyToken } from "../middleware/auth.js"

const router = express.Router()

router.post("/create-payment-intent", verfiyToken, createPaymentIntent)
router.post("/webhook", handleWebhook)
router.post("/create-paypal-order", verfiyToken, handleCreateOrder)
router.post("/order/:orderID/capture", verfiyToken, handleCaptureOrder)

export default router
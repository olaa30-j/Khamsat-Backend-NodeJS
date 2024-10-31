import express from "express"
import { createPaymentIntent, handleCaptureOrder, handleCreateOrder } from "../controller/payment.js"
const router = express.Router()

router.post("/create-payment-intent", createPaymentIntent)
router.post("/create-paypal-order", handleCreateOrder)
router.post("/order/:orderID/capture", handleCaptureOrder)
export default router
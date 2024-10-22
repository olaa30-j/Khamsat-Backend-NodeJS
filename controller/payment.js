import Stripe from "stripe"

const {STRIPE_SECRET_KEY} = process.env
if(!STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

const stripe = Stripe(STRIPE_SECRET_KEY)

export const createPaymentIntent = async (req, res) => {
    const {amount} = req.body
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'USD',
            automatic_payment_methods: {enabled: true}
        })
        return res.status(200).json({message: "Success", clientSecret: paymentIntent.client_secret})
    } catch(error) {
        res.status(500).json({ message: "Server failed to create payment intent" });
    }
}
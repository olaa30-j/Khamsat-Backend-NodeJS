import Stripe from "stripe"
import { createOrderAfterPayment } from "./orders.js";

const { STRIPE_SECRET_KEY } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

const stripe = Stripe(STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    const {amount, order} = req.body
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'USD',
            automatic_payment_methods: {enabled: true},
            metadata: {
                order
            }
        })
        return res.status(200).json({message: "Success", clientSecret: paymentIntent.client_secret})
    } catch(error) {
        res.status(500).json({ message: "Server failed to create payment intent" });
    }
}

export const handleWebhook = async (req, res) => {
    const event = req.body;

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        handlePaymentIntentSucceeded(paymentIntent);
        break;
    }
    res.status(200).json({message: 'Recieved'})
}

const handlePaymentIntentSucceeded = async (paymentIntent)=> {
    // const order: IOrder = { // !!! for testing. remove this and get data from cart
    //     user_id: '66febc9bd66445b2cf6466a1',
    //     items: [
    //       {
    //         service_id: '66fb0c9ec51b9b0c3abfcc9c',
    //          quantity: 2,
    //          price:5,
    //          upgrades: [
    //           {id: '1', price: 5}
    //          ]
    //         }
    //     ],
    //     amount: 50
    // }
        const order = JSON.parse(paymentIntent.metadata.order)
        console.log(order);
        for (let itemIndex in order.items) {
            const newOrder = { 
                user_id:order.userId, 
                items: [{
                    service_id: order.items[itemIndex].id, quantity: order.items[itemIndex].quantity,
                    upgrades: order.items[itemIndex].upgrades.map(u=> u.id)
                }], 
                total: order.amount }
            await createOrderAfterPayment(newOrder)        
        }
}

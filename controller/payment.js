import Stripe from "stripe"
import { createOrderAfterPayment } from "./orders.js";

const {PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL} = process.env
const { STRIPE_SECRET_KEY } = process.env;
if (!STRIPE_SECRET_KEY) throw new Error("Stripe secret key is not defined");

const stripe = Stripe(STRIPE_SECRET_KEY);

/* Stripe */
export const createPaymentIntent = async (req, res) => {
    const {amount, order} = req.body
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'USD',
            automatic_payment_methods: {enabled: true},
            metadata: {
                order,
                userId: req.user.id
            }
        })
        return res.status(200).json({message: "Success", clientSecret: paymentIntent.client_secret})
    } catch(error) {
        res.status(500).json({ message: "Server failed to create payment intent", error: error.message });
    }
}

const handlePaymentIntentSucceeded = async (paymentIntent)=> {
        const order = JSON.parse(paymentIntent.metadata.order)
        const userId = paymentIntent.metadata.userId
        console.log(order, userId);
        await createOrderAfterPayment(order, userId)        
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



/* Paypal */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_API_URL) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (order) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    order
  );

  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_API_URL}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: order.amount,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log(response.status)
  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID, order, userId) => {
  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  const { jsonResponse, httpStatusCode } = await handleResponse(response);

  // Only store data if payment is successful
  if (httpStatusCode === 201 && jsonResponse.status === "COMPLETED") {
    createOrderAfterPayment(order, userId)
  }

  return { jsonResponse, httpStatusCode };
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    console.log(JSON.stringify(jsonResponse))
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

export const handleCreateOrder = async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { order } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(order);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export const handleCaptureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { order } = req.body;
    const userId = req.user.id
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID, order, userId);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

const express = require("express");
const app = express();
const cors = require("cors");
const { resolve } = require("path");
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
app.use(cors());
app.use(express.static(process.env.STATIC_DIR));
app.use(express.json()); // Add this line to parse JSON data in the request body

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "public/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: currency,
      amount: amount,
      automatic_payment_methods: { enabled: true },
    });
    console.log(paymentIntent);
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);

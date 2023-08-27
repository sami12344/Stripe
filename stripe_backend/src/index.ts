import express from 'express'
import cors from 'cors'
import { v4 as uuid } from 'uuid'

import dotenv from 'dotenv'
import Stripe from 'stripe'
import { log } from 'console'
dotenv.config()

const key = process.env.KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16', // Update to match your Stripe TypeScript definitions version
})


const app = express()
app.use(express.json())
app.use(cors())
const port = 3000
app.post('/payment', async (req, res) => {
  try {
    const { product, token } = req.body
    console.log('PRODUCT', product)
    console.log('PRICE', product.price)

    const idempotencyKey = uuid()

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    })

    const charge = await stripe.charges.create(
      {
        amount: product.price * 100, // Convert price to cents
        currency: 'usd',
        customer: customer.id,
        receipt_email:token.email,
        description: `purchase of ${product.name}`,
        shipping:{
         name:token.card.name,
         address:{
          country: token.card.address_country
         }
        }

      },
      { idempotencyKey } // Corrected option name
    )

    res.status(200).json(charge)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while processing the payment.' })
  }
})

app.get('/', (req, res) => {
  res.send('Hello, Express and TypeScript!')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

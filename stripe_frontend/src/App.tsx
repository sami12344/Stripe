
import StripeCheckout, { Token } from 'react-stripe-checkout'

import './App.css'

function App() {
  const product = {
    name: 'React from Facebook',
    price: 10,
    productBy: 'Facebook',
  }

  const makePayment = (token: Token) => {
    const body = {
      token,
      product,
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    return fetch('http://localhost:3000/payment', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log('RESPONSE', response)
        const { status } = response
        console.log('STATUS', status)
      })
      .catch((error) => console.log(error))
  }
  const stripeKey = process.env.REACT_APP_STRIPE_API_KEY

  if (!stripeKey) {
    console.error('Stripe API key is missing.')
    return null
  }
   return (
     <div className='App'>
       <StripeCheckout
         token={makePayment}
         stripeKey={stripeKey}
         name='Product Name'
         description='Product Description'
         amount={product.price * 100}
         currency='USD'
         shippingAddress
         billingAddress
       />
     </div>
   )
}

export default App

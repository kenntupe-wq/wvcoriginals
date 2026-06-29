import Stripe from 'stripe';

export async function onRequestPost({ request, env }) {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    const body = await request.json();
    const { amount, currency, items, customer } = body;

    if (!amount || typeof amount !== 'number' || amount < 50) {
      return new Response(JSON.stringify({ error: 'Invalid order amount.' }), { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency || 'usd',
      receipt_email: customer && customer.email,
    });

    return new Response(JSON.stringify({ client_secret: paymentIntent.client_secret }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Could not start payment.' }), { status: 500 });
  }
}

import express from 'express';
import { body, validationResult } from 'express-validator';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

const router = express.Router();

router.get('/prices', checkAuth, async (_req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_PK,
  });

  res.status(200).json({ data: prices, errors: null });
});

router.post(
  '/session',
  body('priceId').exists(),
  checkAuth,
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map(error => {
        return {
          message: error.msg,
        };
      });
      return res.status(422).json({ errors, data: null });
    }

    const { priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/posts`,
      cancel_url: `${process.env.CLIENT_URL}/payment-error`,
    });

    return res.status(201).json({ data: session, errors: null });
  },
);

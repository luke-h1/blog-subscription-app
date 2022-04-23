import express from 'express';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

const router = express.Router();

router.get('/prices', checkAuth, async (_req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET,
  });

  res.status(200).json({ data: prices, errors: [] });
});

// needs validation to check priceId is not null
router.post('/session', checkAuth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      email: req.user,
    },
  });

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/posts`,
      cancel_url: `${process.env.CLIENT_URL}/posts/plans`,
      customer: user?.stripeCustomerId,
    },
    {
      apiKey: process.env.STRIPE_SECRET,
    },
  );
  return res.status(201).json({ data: session, errors: [] });
});

export default router;

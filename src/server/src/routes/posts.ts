/* eslint-disable no-case-declarations */
import dotenv from 'dotenv';
import express from 'express';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

dotenv.config();

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      email: req.user,
    },
  });

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user?.stripeCustomerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    },
    {
      apiKey: process.env.STRIPE_PK,
    },
  );

  if (!subscriptions.data.length) {
    return res.status(200).json({ data: null, errors: 'no subscriptions' });
  }

  // bad types from stripe
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const plan = subscriptions.data[0].plan.nickname;

  switch (plan) {
    case 'Basic':
      const basicPosts = await prisma.post.findMany({
        where: {
          access: 'BASIC',
        },
      });
      return res.status(200).json({ data: basicPosts, errors: null });

    case 'Standard':
      const standardPosts = await prisma.post.findMany({
        where: {
          access: 'STANDARD',
        },
      });
      return res.status(200).json({ data: standardPosts, errors: null });

    case 'Premium':
      const premiumPosts = await prisma.post.findMany({
        where: {
          access: 'PREMIUM',
        },
      });
      return res.status(200).json({ data: premiumPosts, errors: null });

    default:
      return null;
  }
});
export default router;

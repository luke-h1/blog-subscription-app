/* eslint-disable no-case-declarations */
import dotenv from 'dotenv';
import express from 'express';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

dotenv.config();

const router = express.Router();

// temp endpoint to seed DB with posts
router.post('/', async (req, res) => {
  await prisma.post.create({
    data: {
      access: 'BASIC',
      title: 'test title',
      content: 'lorem ipsum dolor sit amet',
      imageUrl:
        'https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    },
  });
  await prisma.post.create({
    data: {
      access: 'PREMIUM',
      title: 'test title',
      content: 'lorem ipsum dolor sit amet',
      imageUrl:
        'https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    },
  });
  await prisma.post.create({
    data: {
      access: 'STANDARD',
      title: 'test title',
      content: 'lorem ipsum dolor sit amet',
      imageUrl:
        'https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    },
  });
  await prisma.post.create({
    data: {
      access: 'BASIC',
      title: 'test title',
      content: 'lorem ipsum dolor sit amet',
      imageUrl:
        'https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    },
  });
  await prisma.post.create({
    data: {
      access: 'PREMIUM',
      title: 'test title',
      content: 'lorem ipsum dolor sit amet',
      imageUrl:
        'https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    },
  });
  await prisma.post.create({
    data: {
      access: 'STANDARD',
      title: 'test title',
      content: 'lorem ipsum dolor sit amet',
      imageUrl:
        'https://images.unsplash.com/photo-1542995470-870e12e7e14f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    },
  });
  return res.status(201).json({ msg: 'created' });
});

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
      apiKey: process.env.STRIPE_SK,
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

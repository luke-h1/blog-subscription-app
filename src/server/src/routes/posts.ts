/* eslint-disable no-case-declarations */
import dotenv from 'dotenv';
import express from 'express';
import { param, validationResult } from 'express-validator';
import { checkAdmin } from '../middleware/checkAdmin';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

dotenv.config();

const router = express.Router();

// admin endpoint to seed DB with posts
router.post('/', checkAdmin, async (_req, res) => {
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
    // basic users have access to only 'BASIC' posts
    case 'Basic':
      const basicPosts = await prisma.post.findMany({
        where: {
          access: 'BASIC',
        },
      });
      return res.status(200).json({ data: basicPosts, errors: null });

    // standard users have access to 'STANDARD' & 'BASIC' posts
    case 'Standard':
      const standardPosts = await prisma.post.findMany({
        where: {
          access: 'STANDARD',
          OR: [{ access: 'BASIC' }],
        },
      });
      return res.status(200).json({ data: standardPosts, errors: null });

    // premium users have access to everything
    case 'Premium':
      const premiumPosts = await prisma.post.findMany({});
      return res.status(200).json({ data: premiumPosts, errors: null });

    default:
      return null;
  }
});

router.get(
  '/:id',
  param('id')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('id is a required field'),
  checkAuth,
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map(error => {
        return {
          message: error.msg,
        };
      });
      return res.status(400).json({ errors, data: null });
    }

    const { id } = req.params;

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
        const basicPosts = await prisma.post.findFirst({
          where: {
            access: 'BASIC',
            id,
          },
        });
        return res.status(200).json({ data: basicPosts, errors: null });

      case 'Standard':
        const standardPosts = await prisma.post.findFirst({
          where: {
            access: 'STANDARD',
            id,
          },
        });
        return res.status(200).json({ data: standardPosts, errors: null });

      case 'Premium':
        const premiumPosts = await prisma.post.findFirst({
          where: {
            access: 'PREMIUM',
            id,
          },
        });
        return res.status(200).json({ data: premiumPosts, errors: null });

      default:
        return null;
    }
  },
);

export default router;

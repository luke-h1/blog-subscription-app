import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma';
import { checkAuth } from '../middleware/checkAuth';
import { stripe } from '../utils/stripe';

dotenv.config();

const router = express.Router();

router.post(
  '/register',
  body('email').isEmail().withMessage('please enter a valid email'),
  body('password')
    .isLength({ min: 6, max: 70 })
    .withMessage('password must be between 6 & 70 characters long'),
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

    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(409).json({
        errors: [{ message: 'user already exists' }],
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SK,
      },
    );
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        stripeCustomerId: customer.id,
      },
    });

    const token = await jwt.sign(
      {
        user: newUser,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return res.status(201).json({
      errors: null,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          stripeCustomerId: customer.id,
        },
      },
    });
  },
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return res.status(401).json({
      errors: [{ message: "User doesn't exist" }],
      data: null,
    });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({
      errors: [{ message: 'Invalid credentials' }],
      data: null,
    });
  }

  const token = await jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  return res.status(200).json({
    errors: null,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        stripeCustomerId: user.stripeCustomerId,
      },
    },
  });
});

router.get('/me', checkAuth, async (req, res) => {
  const user = await prisma.user.findFirst({ where: { email: req.user } });

  return res.status(200).json({
    errors: null,
    data: {
      user: {
        id: user?.id,
        email: user?.email,
      },
    },
  });
});
export default router;

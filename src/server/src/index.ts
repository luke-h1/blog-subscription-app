import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const main = async () => {
  const app = express();

  app.use(compression());
  app.set('trust-proxy', 1);

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    }),
  );

  app.use(express.json());

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
};

main().catch(e => console.error(e));

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      STRIPE_PK: string;
      STRIPE_SK: string;
      CLIENT_URL: string;
    }
  }
}

export {};

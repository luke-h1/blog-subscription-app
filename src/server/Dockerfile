FROM node:16 as builder

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm ci

COPY . . 
RUN npm run build

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env.example . 
COPY .env.production . 
COPY .env .
COPY .env.production .env 

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist 

ENV NODE_ENV production 

EXPOSE 7000

CMD ["node", "dist/index.js"]

USER node
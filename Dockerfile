FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]

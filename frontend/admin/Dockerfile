FROM node:alpine

LABEL authors="noiss"

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
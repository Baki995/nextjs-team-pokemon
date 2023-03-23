FROM node:16-alpine3.14

WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

RUN npm install --quiet -g nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

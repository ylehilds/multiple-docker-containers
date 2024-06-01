FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install -y

COPY . .

EXPOSE 4000

CMD ["npm", "start"]

FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install -y

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev"]

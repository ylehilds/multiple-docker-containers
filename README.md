# Multiple Docker Containers
This personal project demonstrates how to run multiple docker containers using docker-compose. The project consists of a Fastify API server, React frontend (QuizMaker), and Api backend using Nodejs.

live project: http://129.153.82.90:8080 (QuizMaker frontend), http://129.153.82.90:8081 (QuizMaker API backend), http://129.153.82.90:4000/activities (API backend), and http://129.153.82.90:4000/scriptures (API backend)

## 📑 References

> **App Details**  
> See the [QuizMaker README](./startup/README.md) for detailed information.

> **Important Note to run this application**  
> Follow the [steps.txt](steps.txt) guide to run multiple Docker containers on the same server.

## 🔌 API Skeleton
- See startup > index.js

## 🛠 Tech Stack
- **Runtime:** Node.js (Node 22)
- **Framework:** Express.js, Fastify & React
- **Containerization:** Docker (single image; extendable with Compose)

# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://www.fastify.io/docs/latest/).

## 📄 License
MIT — see `LICENSE`.

## 👤 Author
**Lehi Alcantara**  
🌐 https://www.lehi.dev  
✉️ lehi@lehi.dev

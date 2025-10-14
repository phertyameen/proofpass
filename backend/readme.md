# 🧾 ProofPass Backend

The backend API for **ProofPass**, a decentralized event verification and attendance system.  
It powers smart contract interactions, event creation, user verification, and attendance tracking.

🌐 **Live API:** [https://proofpass.onrender.com](https://proofpass.onrender.com)  
📦 **Frontend Repo:** [ProofPass Frontend (if applicable)](https://github.com/phertyameen/proofpass-frontend)

---

## 🚀 Features

- 🧠 Built with **NestJS + TypeORM**
- 🔐 JWT-based authentication
- 🧾 Integration with deployed **Ethereum smart contracts**
- 🗂️ PostgreSQL database hosted on **Neon**
- ☁️ Hosted on **Render**
- 🧩 Follows clean architecture and modular design

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend Framework | [NestJS](https://nestjs.com) |
| ORM | [TypeORM](https://typeorm.io) |
| Database | [PostgreSQL (Neon)](https://neon.tech) |
| Blockchain | [Hardhat + Ethers.js](https://hardhat.org) |
| Hosting | [Render](https://render.com) |
| Environment Variables | [dotenv](https://www.npmjs.com/package/dotenv) |

---

## 📂 Backend Structure

backend/
├── src/
│ ├── modules/ # Feature modules (auth, users, events, etc.)
│ ├── config/ # Configuration and environment setup
│ ├── main.ts # Application entry point
│ └── app.module.ts # Root module
├── .env
├── package.json
├── tsconfig.json
└── README.md


---

## 🔧 Environment Variables

Create a `.env` file at the root of your backend directory.

```bash
DATABASE_URL=postgres://<username>:<password>@<host>/<database>
PORT=5000
JWT_SECRET=<your-secret-key>
NODE_ENV=production
```

# Optional: blockchain
```bash
TREASURY_ADDRESS=<deployer-or-treasury-address>
BASESCAN_API_KEY=<your-basescan-api-key>

git clone https://github.com/phertyameen/proofpass.git
cd backend
npm install
```

Start the development server:
```bash
npm run start:devStart the development server:

npm run start:dev
```

Then visit:
👉 http://localhost:5000

## 🧱 Database (Neon Setup)

Create a PostgreSQL database on Neon
.

Copy your connection string (e.g.):

postgres://user:password@ep-rapid-db.neon.tech/proofpass


Paste it into .env as DATABASE_URL.

Synchronize entities automatically (for dev):

npm run start:dev
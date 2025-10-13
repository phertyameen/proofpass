# 🎟️ ProofPass Smart Contracts

A blockchain-based **event attendance and verification system** built on **Base** for **fast**, **secure**, and **profitable** on-chain event management.

---

## 🏗️ Architecture

The **ProofPass** smart contract suite powers the event lifecycle from creation to check-in and settlement.

### Core Components
- **Event Registry** — Create, manage, and track events on-chain  
- **Ticketing System** — Mint and manage event passes (ERC-721 / ERC-1155)  
- **Check-in System** — Verify attendee presence with wallet signature or QR scan  
- **Revenue Splitter** — Distribute payments between platform and organizer  
- **Verification Layer** — Immutable record of attendance stored on Base  
- **Future Analytics** — Attendance insights and engagement statistics  

---

## 📋 Contract Details

### Network Information
- **Blockchain:** Base Sepolia Testnet  
- **Contract Addresses:** `{
  - "eventRegistry": "0x716c9b4973a08Cb6340C048e52fdbA6893F2DA25",
  - "attendanceVerifier": "0x55Aaed643EE739eEDf5B6f5F524Ecc7c57b674E5",
}` 
- **Block Explorer:** [BaseScan (Testnet)](https://sepolia.basescan.org/)  
- **Network RPC:** `https://sepolia.base.org`  
- **Chain ID:** 84532  

---

### Contract Features
- ✅ Event creation and on-chain metadata storage  
- ✅ Ticket minting and purchase tracking  
- ✅ Secure attendee check-in (QR or signature-based)  
- ✅ Automatic revenue split for organizers and platform  
- ✅ Role-based access control (Owner / Organizer / Attendee)  
- ✅ Event emission for frontend integration  
- ✅ Gas-optimized Solidity 0.8+ implementation  

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js and npm
node --version   # v18.0.0 or higher
npm --version    # v8.0.0 or higher
```

# Development tools
```bash
npm install -g hardhat
```

Installation
# Clone the repository
```bash
git clone https://github.com/phertyameen/proofpass
cd proofpass/contracts
```

# Install dependencies
```bash
npm install
```

# Copy environment variables
- cp .env.example .env

- Environment Configuration

- Create a .env file with the following variables:

# Base Sepolia Configuration
- BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
- PRIVATE_KEY=your_private_key_here

# Network Configuration
- CHAIN_ID=84532
- BLOCK_CONFIRMATIONS=5

## 🔧 Development
Compiling Contracts

# Compile smart contracts
npx hardhat compile

# Clean and recompile
```bash
npx hardhat clean && npx hardhat compile
```

Testing
# Run all tests
```bash
npm test
```

Deployment
# Deploy to Base Sepolia
```bash
npx hardhat run scripts/deploy.js --network base-sepolia
```

# Verify contract on BaseScan
```bash
npx hardhat verify --network base-sepolia <contract_address>
```

## 📚 Contract API
Core Functions
Event Management

- createEvent(string name, uint256 price, uint256 capacity, bool sponsorMode)
Creates a new event with defined capacity, price, and sponsorship mode.

- buyTicket(uint256 eventId)
Allows attendees to buy event tickets; funds go to escrow until settlement.

- sponsorGuest(uint256 eventId, address attendee)
Organizer pre-pays for guests (sponsored entry).

- checkIn(uint256 eventId, address attendee)
Marks attendance and emits an AttendeeCheckedIn event.

- settleEvent(uint256 eventId)
Distributes funds between organizer and platform.

## 🔗 Useful Links

- Base Faucet: https://faucet.base.org

- Base Bridge: https://bridge.base.org

- Docs: https://docs.base.org

- Status: https://status.base.org

## 📊 Gas Optimization
Estimated Gas Costs (Base Sepolia)
Function	Gas (approx.)	USD Cost*
Create Event	130,000	$0.008
Buy Ticket	90,000	$0.006
Check In	60,000	$0.004
Settle Event	70,000	$0.005

🤝 Contributing
Workflow

Fork the repository

Create a new branch (git checkout -b feature/amazing-feature)

Write tests for your feature

Implement your changes

Run tests (npm test)

Commit and push (git commit -m 'Add amazing feature')

Open a Pull Request

📄 License

This project is licensed under the MIT License — see the LICENSE
 file for details.

🙏 Acknowledgments

Base — for an efficient and developer-friendly L2 environment

OpenZeppelin — for secure and audited smart contract libraries

Hardhat — for an excellent local development & deployment experience

Base Builders Community — for resources, feedback, and support

**Built with ❤️ on Base** | **Revolutionizing event attendance with on-chain trust and rewards. **
<div align="center">

  <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/ethereum/ethereum.png" alt="Ethereum Logo" width="80" />

  # 🚗⚡ ParkEase

  **The Future of Decentralized, Trustless Parking Management**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
  [![Web3.js](https://img.shields.io/badge/web3.js-F16822?style=for-the-badge&logo=web3.js&logoColor=white)](https://web3js.readthedocs.io/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-030407.svg?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](https://opensource.org/licenses/MIT)

  <p align="center">
    <strong>ParkEase</strong> is an elite Web3 DApp bridging Ethereum Smart Contracts with a high-performance React frontend. It eliminates centralized server failures, ensures immutable booking records, and handles dynamic, minute-by-minute billing entirely on-chain.
  </p>

</div>

---

## 📸 Platform Preview

<div align="center">
  <img alt="ParkEase Live Matrix Booked Slot" width="100%" style="border-radius: 12px; border: 1px solid #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);" src="https://github.com/user-attachments/assets/9c32dbb3-5083-41f6-a77c-b49d26241d6c" />
  <p><i>The Live Matrix: Real-time synchronization of on-chain data.</i></p>
</div>

---

## ✨ Premium Features

| Feature | Capabilities & Tech Details |
| :--- | :--- |
| **🟢 Live Matrix Synchronization** | A real-time, visual grid displaying dynamic slot availability synced directly from the blockchain state. *No page refreshes required.* |
| **💳 Dynamic On-Chain Billing** | Smart contracts automatically calculate precise fees using `(Block.timestamp - Check-in Timestamp) * RatePerMinute`. |
| **🎟️ Digital PDF Ticketing** | Generates physical-ready, cyberpunk-styled PDF receipts bridging digital blockchain verification (via QR Codes) with real-world utility. |
| **🛡️ Cryptographic Security** | Tamper-proof booking ledgers. Only the exact wallet address that books a slot has the cryptographic authority to release it. |
| **🛑 Admin "Overseer" Console** | Owner-exclusive dashboard featuring facility pausing (Emergency Stop pattern), live revenue analytics, and secure treasury withdrawals. |
| **⚡ Zero-Latency Onboarding** | "Guest" Web3 initialization allows users to view live facility occupancy on the landing page *before* connecting a MetaMask wallet. |

---

## 🖥️ System Walkthrough

### 1. Zero-Latency Onboarding
> Utilizing a "Guest" Web3 instance, the gateway reads live smart contract data before the user even connects their wallet, ensuring transparency and trust.
<div align="center">
  <img alt="Login Gateway" width="80%" style="border-radius: 12px; border: 1px solid #333;" src="https://github.com/user-attachments/assets/6feede4d-b921-4963-948d-ea2bb5463420" />

</div>
<br>

### 2. The Facility Matrix
> A 3D-perspective UI maps directly to the Solidity `Slot` struct array. Users select empty slots, input their license plate, and sign the transaction via MetaMask.
<div align="center">
  <img alt="Facility Matrix Overview" width="80%" style="border-radius: 12px; border: 1px solid #333;" src="https://github.com/user-attachments/assets/82664b3f-5ae0-470b-b339-02d77f696d74" />

</div>
<br>

### 3. Digital Ticketing & Receipts
> Bridging Web3 with the physical world. Users can review past transactions, view Etherscan hashes, and download dynamically generated PDF tickets for physical gate exits.
<div align="center">
  <img alt="Digital Ticketing" width="80%" style="border-radius: 12px; border: 1px solid #333;" src="https://github.com/user-attachments/assets/42fbb659-c6f2-428e-9b35-501d447cd703" />

</div>
<br>

### 4. Overseer OS (Admin Console)
> An exclusive portal protected by an `onlyOwner` modifier. Features real-time Recharts analytics, active vehicle rosters, treasury sweeps, and a circuit breaker to halt operations.
<div align="center">
  <img alt="Admin Analytics" width="80%" style="border-radius: 12px; border: 1px solid #333; margin-bottom: 10px;" src="https://github.com/user-attachments/assets/69e03691-b224-4085-aa97-ef3c7cd44875" />
  <img alt="Admin Controls" width="80%" style="border-radius: 12px; border: 1px solid #333;" src="https://github.com/user-attachments/assets/47e03973-decc-4fe6-b674-ded24c56c4e3" />
</div>

---

## 🏗️ System Architecture

Unlike traditional Web2 architectures (Client ↔ Server ↔ Database), ParkEase operates on a completely **Decentralized Architecture**. The logic and the database are one and the same: the Smart Contract.

```mermaid
sequenceDiagram
    participant User as MetaMask Wallet
    participant UI as React Frontend
    participant Web3 as Web3.js Provider
    participant EVM as Ganache (Local Blockchain)
    participant Contract as ParkEase.sol
    
    User->>UI: Clicks "Book Slot"
    UI->>Web3: Format Transaction (Slot ID, License Plate)
    Web3->>EVM: Send RPC Request
    EVM->>Contract: Execute Smart Contract Logic
    Contract-->>EVM: Emit SlotBooked Event & Update State
    EVM-->>Web3: Return Transaction Hash
    Web3-->>UI: Trigger State Refresh
    UI-->>User: Update Live Matrix Grid (Neon Red)
````

-----

## 🚀 Getting Started (Local Deployment)

Follow these steps to deploy ParkEase on your local machine.

### 1\. Prerequisites

Ensure you have the following installed:

  * **[Node.js](https://nodejs.org/)** (v16+ recommended)
  * **[Ganache](https://trufflesuite.com/ganache/)** (Running locally on Port `7545`)
  * **[MetaMask](https://metamask.io/)** browser extension (Configured to `http://127.0.0.1:7545`)

### 2\. Clone the Repository

```bash
git clone [https://github.com/prakash0067/ParkEase.git](https://github.com/prakash0067/ParkEase.git)
cd ParkEase
```

### 3\. Deploy the Smart Contract

Keep Ganache open and running. Compile and deploy the Solidity contract to your local blockchain:

```bash
truffle compile
truffle migrate --reset
```

> 🛑 **CRITICAL STEP: Connect the Frontend to the Blockchain**
> When you run the migrate command, your terminal will output a **Contract Address**. You must update the frontend configuration to point to this new address\!
>
> 1.  Open `frontend/src/contractData.js`.
> 2.  Paste your newly deployed **Contract Address** into the `contractAddress` variable.
> 3.  Ensure the **ABI array** matches your compiled contract (found in `build/contracts/ParkEase.json`).
>
> *Example of what `contractData.js` should look like:*
>
> ```javascript
> export const NETWORK_CONFIG = { rpcUrl: "[http://127.0.0.1:7545](http://127.0.0.1:7545)" };
> export const contractAddress = "0xYourNewContractAddressHere...";
> export const contractABI = [ /* Paste Array Here */ ];
> ```

### 4\. Launch the Application

Start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` in your browser, connect your MetaMask wallet, and experience the future of parking\!

-----

## 🤝 Contributing

Contributions, issues, and feature requests are highly welcome\! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/prakash0067/ParkEase/issues) if you want to contribute.

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

<br>
<div align="center">
  <i>"Your keys, your car, your parking spot."</i><br><br>
  Built with 💻 and ☕ for the Web3 ecosystem.
</div>

# Backend for CrossChain Lending Platform

## Overview

The backend is responsible for managing cross-chain confirmations between Ethereum and Avalanche. It listens to events from the Ethereum smart contract, processes them, and sends confirmation messages to the Avalanche chain.

## Key Responsibilities

- **Pooling on Ethereum Chain:**  
  Connects to the Ethereum network and listens for lock events emitted by the ETH Vault contract when users lock ETH as collateral.

- **Event Log Processing:**  
  Captures and processes logs/events emitted by the smart contract to track collateral locks in real-time.

- **Cross-Chain Confirmation:**  
  After verifying lock events, the backend sends a confirmation message to the Avalanche chain to finalize the lock, enabling users to borrow USDT on Avalanche.

- **Database:**  
  Uses PostgreSQL to store and manage data related to lock events, confirmations, and user collateral information.

## Tech Stack

- **NestJS:**  
  A progressive Node.js framework used for building efficient and scalable server-side applications.

- **PostgreSQL:**  
  A relational database to persist lock confirmations and related user data.

## How it works

1. Backend listens to Ethereum contract events (lock collateral).
2. Verifies and stores event data in PostgreSQL.
3. Sends confirmation messages via Chainlink CCIP to Avalanche pool contract.
4. Enables seamless cross-chain borrowing experience.

---

This backend is crucial for the **double confirmation** process and ensuring secure cross-chain communication in the lending platform.

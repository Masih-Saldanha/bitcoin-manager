<p align="center">
  <a href="https://github.com/$username-github/$nome-repositorio">
    <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f512.svg" alt="readme-logo" width="80" height="80"> <!-- src="image-link" -->
  </a>

  <h3 align="center">
    BitCoin Manager
  </h3>
</p>

## Description

Bitcoin Manager is a Node.js application that provides an API for retrieving information about Bitcoin transactions. It includes features such as getting details about a Bitcoin address, checking the balance, obtaining UTXO needed to send Bitcoin, and fetching information about a specific transaction.

## API deploy link

https://bitcoin-manager.onrender.com/

## Usage:

```bash
$ git clone https://github.com/Masih-Saldanha/bitcoin-manager.git

$ cd bitcoin-manager

$ npm install
```
Create the .env file based on .env.example
```bash
$ npm run dev
```
## API:

### Health Check
```
- GET /health
    - Check the health status of the server.
    - headers: {}
    - body: {}
```
### Bitcoin Address Details
```
- GET /details/:address
    - Get details about a specific Bitcoin address.
    - headers: {}
    - body: {}
```
### Bitcoin Address Balance
```
- GET /balance/:address
    - Get the balance of a specific Bitcoin address.
    - headers: {}
    - body: {}
```
### UTXO Needed to Send Bitcoin
```
- GET /send
    - Get the UTXO needed to send a specific amount of Bitcoin from an address.
    - headers: {}
    - body: {
        "address": "someBitcoinAddress";
        "bitcoin": 1000;
    }
```
### Transaction Information
```
- GET /tx/:tx
    - Get information about a specific Bitcoin transaction.
    - headers: {}
    - body: {}
```

## Tests:

Run unit tests:

```bash
$ npm run test:unit
```

Run integration tests:

```bash
$ npm run test:integration
```

Run all tests:

```bash
$ npm run test
```

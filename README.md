# Blockchain Medical System

The Blockchain Medical System Blockchain is about removing the middleman and enhance the privacy and confidentiality involved in medical privacy transactional activities within healthcare space. The inherent privacy and security offered by blockchain allows patients retain certain level of granular control and confidential records cannot be transferred between professionals without their absolute consent. Patient confidentiality can be maintained much more effectively thus offering greater scope for them privately accessing medical support.

Blockchain Medical System Contract Example Workflow

1. Medical Staffs/Patient will have to register themselves on the contract. - [&#9745;]

2. Medical Staffs can set and update the message of the day (MOTD). - [&#9745;]

3. Medical Staffs can create purchasable services. - [&#9745;]

4. Registered users can purchase services - [&#9745;]

5. Medical Staffs can upload or edit the medical data. - [ ]

6. Medical Staffs/Patient have to identify themselves in order to securely access to the medical data. - [ ]

7. Patient can authorize 3rd party access to securely access to the medical data. - [ ]

8. Verify the authenticity of the medical record using digital signature that uniquely identifies the issuer of the record. - [ ]

9. Medical bills payment can be issued by the Medical Staffs and paid in cryptocurrency by the Patient. - [ ]

## Ethereum Address to receive the certification:

`0xd363506E11F5Ff0B76B850aB1e42B35A8C41EFA9`

## Setup and testing for the Smart Contract - Locally

```
Local testnet using Ganache - http://127.0.0.1:7574
truffle test
truffle migrate --network test
Add and point the REACT_APP_CONTRACT_ADDRESS in .env
Uncomment Local TestNet configurations in /src/util/interact.js
```

## Setup and testing for the Smart Contract - Rinkeby or other testnet

```
truffle test
truffle migrate --network rinkeby
Add deployed contract address to REACT_APP_CONTRACT_ADDRESS in .env-example
Add infura or any provider to REACT_APP_API_URL in .env-example
Add Wallet MNEMONIC, PUBLIC_KEY and PRIVATE_KEY in .env-example
Optional, Add Etherscan API to ETHERSCAN_API_KEY in .env-example
Configure the .env-example and rename it to .env
```

## Setup and Installing dependencies for Front-end App

```
git clone https://github.com/seiriosalpha/blockchain-developer-bootcamp-final-project.git
cd blockchain-developer-bootcamp-final-project
npm install
npm start
mv .env-example .env
```

## Access to the current Front-end deployment

`128.199.125.88:3000`

## Project Screencast

`To Be Updated`

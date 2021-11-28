import BMS from '../contracts/BMS.json'
import getWeb3 from './getWeb3'
require('dotenv').config()
//const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
//const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
//const web3 = createAlchemyWeb3(alchemyKey);

//Connecting to local blockchain using web3 and HttpProvider
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
const contractAddress = '0xb1EF62F80c079F9f57084e60E763D991866e5bB9'

//Load the smart contract
export const BMSContract = new web3.eth.Contract(BMS.abi, contractAddress)

//Return the message stored in the smart contract
export const loadCurrentMessage = async () => {
  const message = await BMSContract.methods.message().call()
  return message
}

//Return the User info stored in the smart contract
export const CheckUser = async (userAdd) => {
  const message = await BMSContract.methods.users(userAdd).call()
  if (message.name.trim() != '') {
    return {
      status: '😸 Found it! Name: ' + message.name + ' Role: ' + message.role,
    }
  } else {
    return {
      status: '😥 User not found! ',
    }
  }
}

//Connect current selected address to our dApp and update our UI accordingly
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const obj = {
        status: '👆🏽 Write a message in the text-field above.',
        address: addressArray[0],
      }
      return obj
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      }
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            🦊{' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    }
  }
}

//Check if current selected address is already connected to our dApp and update our UI accordingly
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: '👆🏽 Write a message in the text-field above.',
        }
      } else {
        return {
          address: '',
          status: '😸 Connect to Metamask using the top right button.',
        }
      }
    } catch (err) {
      return {
        address: '',
        status: '😿 ' + err.message,
      }
    }
  } else {
    return {
      address: '',
      status: (
        <span>
          <p>
            {' '}
            😼{' '}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    }
  }
}

//Check for Metamask and if there is no wallet connected, or the Name and Role is an empty string / empty int
export const RegisterUser = async (address, regName, regRole) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status: '💡 Connect your Metamask wallet to register!',
    }
  }
  if (regName.trim() === '' && regRole.trim() === '') {
    return {
      status: '❌ Your name and role cannot be empty.',
    }
  }

  //const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0
  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    //	'nonce': nonce,
    data: BMSContract.methods.createUser(regName, regRole).encodeABI(),
  }
  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })
    return {
      status: (
        <span>
          ✅{' '}
          <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    }
  } catch (error) {
    return {
      status: '😿 ' + error.message,
    }
  }
}

//Check for Metamask and if there is no wallet connected, or the Name and Role is an empty string / empty int
export const CreateService = async (address, servicename, price, info, qty) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        '💡 Connect your Metamask wallet to update the message on the blockchain.',
    }
  }
  if (
    servicename.trim() === '' &&
    price.trim() === '' &&
    info.trim() === '' &&
    qty.trim() === ''
  ) {
    return {
      status: '❌ Your message cannot be an empty string.',
    }
  }

  //const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0
  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    //	'nonce': nonce,
    data: BMSContract.methods
      .createService(servicename, price, info, qty)
      .encodeABI(),
  }
  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })
    return {
      status: (
        <span>
          ✅{' '}
          <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    }
  } catch (error) {
    return {
      status: '😿 ' + error.message,
    }
  }
}

//Check for Metamask and if there is no wallet connected, or the message is an empty string
export const updateMessage = async (address, message) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        '💡 Connect your Metamask wallet to update the message on the blockchain.',
    }
  }
  if (message.trim() === '') {
    return {
      status: '❌ Your message cannot be an empty string.',
    }
  }

  //const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0
  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    //	'nonce': nonce,
    data: BMSContract.methods.update(message).encodeABI(),
  }
  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    })
    return {
      status: (
        <span>
          ✅{' '}
          <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    }
  } catch (error) {
    return {
      status: '😿 ' + error.message,
    }
  }
}

export const Payment = async (address, value) => {
  const etherAmount = web3.toBigNumber(value)
  const weiValue = web3.toWei(etherAmount, 'ether')

  //TODO --> Setup payment!
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    //	'nonce': nonce,
    gas: 30000,
    value: weiValue,
    //data: helloWorldContract.methods.update(message).encodeABI(),
  }
}

import BMS from '../contracts/BMS.json'
import BigNumber from 'bignumber.js'
//import getWeb3 from './getWeb3'
require('dotenv').config()

//Connecting to local blockchain using web3 and HttpProvider
//var Web3 = require('web3')
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
//const contractAddress = '0x8Ef79b1389Cc9e1862718579d04729b39Ac9B5E9'

//Connecting to rinkeby blockchain using web3 and Infura HttpProvider
var Web3 = require('web3')
var web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.REACT_APP_API_URL),
)
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

//Load the smart contract
export const BMSContract = new web3.eth.Contract(BMS.abi, contractAddress)

//Return the message stored in the smart contract
export const loadCurrentMessage = async () => {
  const message = await BMSContract.methods.message().call()
  return message
}

//Return the message stored in the smart contract
export const loadServicePrice = async (sid) => {
  const value = await BMSContract.methods.services(sid).call()
  return value.price
}

//Check for Metamask and if there is no wallet connected, or the Name and Role is an empty string / empty int
export const ApproveUser = async (address, approveaddress) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status: '💡 Connect your Metamask wallet to register!',
    }
  }
  if (approveaddress.trim() === '') {
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
    data: BMSContract.methods.addMember(approveaddress).encodeABI(),
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
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
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
export const RegisterUser = async (address, regName) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status: '💡 Connect your Metamask wallet to register!',
    }
  }
  if (regName.trim() === '') {
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
    data: BMSContract.methods.createUser(regName).encodeABI(),
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
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
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
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
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
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
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
export const BuyService = async (address, sid, sqty, price) => {
  const etherAmount = BigNumber(price).toString()
  const weiValue = parseInt(web3.utils.toWei(etherAmount, 'ether')).toString(16)
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        '💡 Connect your Metamask wallet to update the message on the blockchain.',
    }
  }
  if (sid.trim() === '' && sqty.trim() === '') {
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
    value: weiValue,
    data: BMSContract.methods.purchaseService(sid, sqty).encodeABI(),
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
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
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

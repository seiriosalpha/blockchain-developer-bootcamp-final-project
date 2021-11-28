import React from 'react'
import { useEffect, useState } from 'react'
import {
  BMSContract,
  connectWallet,
  updateMessage,
  RegisterUser,
  CheckUser,
  CreateService,
  loadCurrentMessage,
  getCurrentWalletConnected,
} from './util/interact.js'

import logo from './bmslogo.svg'

const BMS = () => {
  //state variables
  const [walletAddress, setWallet] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('No connection to the network.') //default message
  const [newMessage, setNewMessage] = useState('')
  const [regName, RegisterName] = useState('')
  const [regRole, RegisterRole] = useState('')
  const [userAdd, SetUserAdd] = useState('')
  const [serviceName, RegisterServiceName] = useState('')
  const [servicePrice, RegisterPrice] = useState('')
  const [serviceInfo, RegisterInfo] = useState('')
  const [serviceQty, RegisterQty] = useState('')

  //called only once
  useEffect(async () => {
    //we want to display this smart contract in our UI
    const message = await loadCurrentMessage()
    setMessage(message)
    addSmartContractListener()

    //Returns an array containing the Metamask addresses currently connected to our dApp.
    const { address, status } = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)

    //Listens for state changes in the Metamask wallet
    addWalletListener()
  }, [])

  //Listen for our smart contract's UpdatedMessages event, and update our UI to display the new message.
  function addSmartContractListener() {
    BMSContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus('😿 ' + error.message)
      } else {
        setMessage(data.returnValues[1])
        setNewMessage('')
        setStatus('🎉 Your message has been updated!')
      }
    })
  }

  //Implementing wallet listener to update the UI when wallet's state changes, such as when the user disconnects or switches accounts.
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus('👆🏽 Write a message in the text-field above.')
        } else {
          setWallet('')
          setStatus('😸 Connect to Metamask using the top right button.')
        }
      })
    } else {
      setStatus(
        <p>
          {' '}
          😼{' '}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>,
      )
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  }

  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage)
    setStatus(status)
  }

  const onRegisterPressed = async () => {
    const { status } = await RegisterUser(walletAddress, regName, regRole)
    setStatus(status)
  }

  const onCheckUserPressed = async () => {
    const { status } = await CheckUser(userAdd)
    setStatus(status)
  }

  const onCreateServicePressed = async () => {
    const { status } = await CreateService(
      walletAddress,
      serviceName,
      servicePrice,
      serviceInfo,
      serviceQty,
    )
    setStatus(status)
  }

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={logo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          'Connected: ' +
          String(walletAddress).substring(0, 6) +
          '...' +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <h2 style={{ paddingTop: '5px' }}>Current Message of the Day:</h2>
      <p>{message}</p>
      <h4 style={{ paddingTop: '5px' }}>New Message:</h4>
      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <div></div>
        <input
          type="text"
          placeholder="Please input your name here!"
          onChange={(e) => RegisterName(e.target.value)}
          value={regName}
        />
        <input
          type="text"
          placeholder="Role"
          onChange={(e) => RegisterRole(e.target.value)}
          value={regRole}
        />
        <input
          type="text"
          placeholder="Service Name"
          onChange={(e) => RegisterServiceName(e.target.value)}
          value={serviceName}
        />
        <input
          type="text"
          placeholder="Service Price"
          onChange={(e) => RegisterPrice(e.target.value)}
          value={servicePrice}
        />
        <input
          type="text"
          placeholder="Service Info"
          onChange={(e) => RegisterInfo(e.target.value)}
          value={serviceInfo}
        />
        <input
          type="text"
          placeholder="Service Qty"
          onChange={(e) => RegisterQty(e.target.value)}
          value={serviceQty}
        />
        <input
          type="text"
          placeholder="UserAddress to check, 0xFFfAABBbCC"
          onChange={(e) => SetUserAdd(e.target.value)}
          value={userAdd}
        />
        <p id="status">{status}</p>
        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
        <span>&nbsp;&nbsp;</span>
        <button id="publish" onClick={onRegisterPressed}>
          Register
        </button>
        <span>&nbsp;&nbsp;</span>
        <button id="publish" onClick={onCheckUserPressed}>
          Check User
        </button>
        <span>&nbsp;&nbsp;</span>
        <button id="publish" onClick={onCreateServicePressed}>
          Create Service
        </button>
      </div>
    </div>
  )
}

export default BMS

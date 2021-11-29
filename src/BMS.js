import React from 'react'
import { useEffect, useState } from 'react'
import {
  BMSContract,
  connectWallet,
  updateMessage,
  RegisterUser,
  ApproveUser,
  CreateService,
  BuyService,
  loadServicePrice,
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
  const [userAdd, SetUserAdd] = useState('')
  const [serviceName, RegisterServiceName] = useState('')
  const [servicePrice, RegisterPrice] = useState('')
  const [serviceInfo, RegisterInfo] = useState('')
  const [serviceQty, RegisterQty] = useState('')
  const [sid, SetServiceId] = useState('')
  const [sqty, SetQty] = useState('')
  const [price, setPrice] = useState('value')

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
    const { status } = await RegisterUser(walletAddress, regName)
    setStatus(status)
  }

  const onApproveUserPressed = async () => {
    const { status } = await ApproveUser(walletAddress, userAdd)
    setStatus(status)
  }

  const onBuyPressed = async () => {
    const price = await loadServicePrice(sid)
    const { status } = await BuyService(walletAddress, sid, sqty, price)
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

      <p id="code">{message}</p>

      <h4 style={{ paddingTop: '10px' }}>Set new Message (Owner function):</h4>
      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button
          id="publish"
          style={{ float: 'right' }}
          onClick={onUpdatePressed}
        >
          Update
        </button>
        <h4 style={{ paddingTop: '30px' }}>Register:</h4>
        <input
          type="text"
          placeholder="Please input your name here!"
          onChange={(e) => RegisterName(e.target.value)}
          value={regName}
        />
        <button
          id="publish"
          style={{ float: 'right' }}
          onClick={onRegisterPressed}
        >
          Register
        </button>
        <h4 style={{ paddingTop: '30px' }}>Create Service (Owner function):</h4>
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
        <button
          id="publish"
          style={{ float: 'right' }}
          onClick={onCreateServicePressed}
        >
          Create Service
        </button>
        <h4 style={{ paddingTop: '30px' }}>
          Approve and set as Registered Member (Owner function):
        </h4>
        <input
          type="text"
          placeholder="UserAddress to check, 0xFFfAABBbCC"
          onChange={(e) => SetUserAdd(e.target.value)}
          value={userAdd}
        />
        <button
          id="publish"
          style={{ float: 'right' }}
          onClick={onApproveUserPressed}
        >
          Approve User
        </button>
        <h4 style={{ paddingTop: '30px' }}>
          Purchase Service (Registered Member Only!):
        </h4>
        <input
          type="text"
          placeholder="Service ID"
          onChange={(e) => SetServiceId(e.target.value)}
          value={sid}
        />
        <input
          type="text"
          placeholder="Qty"
          onChange={(e) => SetQty(e.target.value)}
          value={sqty}
        />
        <button id="publish" style={{ float: 'right' }} onClick={onBuyPressed}>
          Buy!
        </button>
      </div>
      <p id="status">{status}</p>
    </div>
  )
}

export default BMS

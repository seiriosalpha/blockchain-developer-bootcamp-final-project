let BN = web3.utils.BN
let BMS = artifacts.require('BMS')
let { catchRevert } = require('./exceptionsHelpers.js')
const {
  items: ItemStruct,
  isDefined,
  isPayable,
  isType,
} = require('./ast-helper')
const truffleAssert = require('truffle-assertions')

contract('BMS', (accounts) => {
  // setting of test variables
  let contract
  const owner = accounts[0]
  const user = accounts[1]
  const notOwner = accounts[2]
  const unregistered = accounts[3]
  const name = 'Meow Cat'
  const role = 1
  const Message = 'Hello'
  const serviceName = 'Health Checkup'
  const price = '5'
  const info = 'This is a health checkup package'
  const quantity = '1'

  // Check contract deployment status
  before('setup contract', async () => {
    contract = await BMS.deployed()
  })

  //Check if user successfully registered
  it('should register a new user', async () => {
    let result = await contract.createUser(name, role, {
      from: owner,
    })
    // emit event user created
    truffleAssert.eventEmitted(result, 'UserCreated', (ev) => {
      return ev.user == owner && ev.name == name && ev.role == role
    })
  })

  //Check if user creation can by done by non-owner
  it('should fail to register by non-owner', async () => {
    await truffleAssert.reverts(
      contract.createUser(name, role, {
        from: notOwner,
      }),
    )
  })

  //Check if MOTD successfully set
  it('should set a MOTD successfully', async () => {
    let result = await contract.update(Message, {
      from: owner,
    })
    // emit event user created
    truffleAssert.eventEmitted(result, 'UpdatedMessages', (ev) => {
      return ev.oldStr == 'meow' && ev.newStr == Message
    })
  })

  //Check if MOTD can by set by non-owner
  it('should fail to set MOTD by non-owner', async () => {
    await truffleAssert.reverts(
      contract.update(Message, {
        from: notOwner,
      }),
    )
  })

  //Check if service successfully created
  it('should create a service successfully', async () => {
    let result = await contract.createService(
      serviceName,
      price,
      info,
      quantity,
      {
        from: owner,
      },
    )
    // emit event user created
    truffleAssert.eventEmitted(result, 'ServiceCreated', (ev) => {
      return (
        ev.name == serviceName &&
        ev.price == price &&
        ev.info == info &&
        ev.quantity == quantity
      )
    })
  })

  //Check if service can be created by non-owner
  it('should fail to create service by non-owner', async () => {
    await truffleAssert.reverts(
      contract.createService(serviceName, price, info, quantity, {
        from: notOwner,
      }),
    )
  })

  //Check if registered user can send value
  it('should send the random value', async () => {
    // register user
    await contract.registerUser(name, role, {
      from: owner,
    })
    // send the production value
    let result = await contract.send(value, {
      from: user,
    })
    // test event
    truffleAssert.eventEmitted(result, 'UserCreated', (ev) => {
      return ev.userAddress == user && ev.value == value
    })
  })

  it('should fail to send value from un-registered user', async () => {
    await truffleAssert.reverts(
      contract.send(value, {
        from: unregistered,
      }),
    )
  })
})

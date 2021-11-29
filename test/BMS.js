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
  /// setting of test variables
  let contract
  const owner = accounts[0]
  const user = accounts[1]
  const notOwner = accounts[2]
  const unregistered = accounts[3]
  const name = 'Meow Cat'
  const Message = 'Hello'
  const serviceName = 'Health Checkup'
  const price = '5'
  const info = 'This is a health checkup package'
  const quantity = '1'

  /// Check contract deployment status
  before('setup contract', async () => {
    contract = await BMS.deployed()
  })

  /// Check if user successfully registered
  it('should register a new user', async () => {
    let result = await contract.createUser(name, {
      from: user,
    })
    /// emit event user created
    truffleAssert.eventEmitted(result, 'UserCreated', (ev) => {
      return ev.user == user && ev.name == name
    })
  })

  /// Check if role is granted to registered user
  it('should approve and grant role to registered user', async () => {
    let result = await contract.addMember(user, {
      from: owner,
    })
    /// emit event user created
    truffleAssert.eventEmitted(result, 'RoleGranted', (ev) => {
      return ev.sender == user
    })
  })

  /// Check if MOTD successfully set
  it('should set a MOTD successfully', async () => {
    let result = await contract.update(Message, {
      from: owner,
    })
    /// emit event user created
    truffleAssert.eventEmitted(result, 'UpdatedMessages', (ev) => {
      return ev.oldStr == 'meow' && ev.newStr == Message
    })
  })

  /// Check if MOTD can by set by non-owner
  it('should fail to set MOTD by non-owner', async () => {
    await truffleAssert.reverts(
      contract.update(Message, {
        from: notOwner,
      }),
    )
  })

  /// Check if service successfully created
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
    /// emit event user created
    truffleAssert.eventEmitted(result, 'ServiceCreated', (ev) => {
      return (
        ev.name == serviceName &&
        ev.price == price &&
        ev.info == info &&
        ev.quantity == quantity
      )
    })
  })

  /// Check if service can be created by non-owner
  it('should fail to create service by non-owner', async () => {
    await truffleAssert.reverts(
      contract.createService(serviceName, price, info, quantity, {
        from: notOwner,
      }),
    )
  })
})

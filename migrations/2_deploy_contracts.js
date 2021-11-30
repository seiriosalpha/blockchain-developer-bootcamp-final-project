require('dotenv').config()
const BMS = artifacts.require('BMS')

module.exports = function (deployer) {
  deployer.deploy(BMS, 'Meow', process.env.PUBLIC_KEY)
}

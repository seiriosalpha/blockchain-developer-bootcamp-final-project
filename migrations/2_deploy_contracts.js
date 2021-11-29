require('dotenv').config()
const BMS = artifacts.require('BMS')

module.exports = function (deployer) {
  deployer.deploy(BMS, 'meow', process.env.PUBLIC_KEY)
}

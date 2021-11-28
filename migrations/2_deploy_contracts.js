const BMS = artifacts.require('BMS')

module.exports = function (deployer) {
  deployer.deploy(BMS, 'meow')
}
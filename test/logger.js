const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const fs = require('fs')
const path = require('path')
const ethUtil = require('ethereumjs-util')

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
const rawAbi = fs.readFileSync(path.join(__dirname, '../data/CreditProtocol.abi.json'), {encoding: 'utf8'})
const cpAbi = JSON.parse(rawAbi)

const cpContract = new web3.eth.Contract(cpAbi, '0x1aa76056924bf4768d63357eca6d6a56ec929131')

console.log(Object.keys(cpContract.events))

cpContract.events.IssueCreditError({
    fromBlock: 0
}, function(error, event){ console.log(error, event) })
.on('data', function(event){
    console.log(event); // same results as the optional callback above
})
.on('error', console.error)

const issueCreditErrorSubscription = web3.eth.subscribe('logs', {
    fromBlock: 0,
    address: '0x1aa76056924bf4768d63357eca6d6a56ec929131',
    topics: ['0x60ef3386514cc5a63a0be3beb3e447f614b09c68697f392e9a5b907f5dbd48b9']
})
issueCreditErrorSubscription.on('data', console.log)

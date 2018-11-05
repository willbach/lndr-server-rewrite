var Web3 = require('web3')
var Tx = require('ethereumjs-tx')
var fs = require('fs')
var path = require('path')
var ethUtil = require('ethereumjs-util')
var testUtil = require('../../test/util/test.util')

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const testPrivkey1  = "bb63b692f9d8f21f0b978b596dc2b8611899f053d68aec6c1c20d1df4f5b6ee2"
const testPrivkey2  = "2f615ea53711e0d91390e97cdd5ce97357e345e441aa95d255094164f44c8652"
const testPrivkey3  = "7d52c3f6477e1507d54a826833169ad169a56e02ffc49a1801218a7d87ca50bd"
const testPrivkey4  = "6aecd44fcb79d4b68f1ee2b2c706f8e9a0cd06b0de4729fe98cfed8886315256"
const testAddress1  = testUtil.privateToAddress(testPrivkey1)
const testAddress2  = testUtil.privateToAddress(testPrivkey2)
const testAddress3  = testUtil.privateToAddress(testPrivkey3)
const testAddress4  = testUtil.privateToAddress(testPrivkey4)
const test04 = '10ec06ab5c5a82273eed6eaf7e62b3d5f0888859'
const tester = '1b5fec5060e51886184d30b3d211d50836087b83'

const ERC20_ABI = [
  // ERC20 functions
  {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},
  {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
  {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
  {"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
  {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
  {"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},
  // ERC20 events
  {"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}
  // {"inputs":[],"payable":false,"type":"constructor"},
]

const sendTestDAI = async() => {
    const nonce = await new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(`0x${testAddress4}`, (e, data) => e ? reject(e) : resolve(data))
    })

    const testDaiAddress = '2839b617726d08d1fe59e279571d35c738d72948'
    const ERC20Contract = web3.eth.contract(ERC20_ABI)
    
    const daiContract = await new Promise((resolve, reject) => {
        ERC20Contract.at(`0x${testDaiAddress}`, (e, data) => e ? reject(e) : resolve(data))
    })

    const txData = daiContract.transfer.getData(`0x${test04}`, 20000000000000000000)

    var rawTx = {
        nonce,
        gasPrice: 20000,
        gasLimit: 300000,
        from: `0x${testAddress4}`,
        to: `0x${testDaiAddress}`,
        value: 0,
        data: txData,
        chainId: 1
    }
    
    const tx = new Tx(rawTx)
    const privateKeyBuffer = Buffer.from(testPrivkey4, 'hex')
    tx.sign(privateKeyBuffer)
    const serializedTx = tx.serialize()

    const txHash = await new Promise((resolve, reject) => {
        return web3.eth.sendRawTransaction(('0x' + serializedTx.toString('hex')), (e, data) => e ? reject(e) : resolve(data))
    }).catch(err => err)

    return txHash
}

sendTestDAI().then(result => console.log(result))

const sendTestETH = async() => {
    const nonce = await new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(`0x${testAddress4}`, (e, data) => e ? reject(e) : resolve(data))
    })

    console.log(nonce)

    var rawTx = {
        nonce,
        gasPrice: 20000,
        gasLimit: 21000,
        from: `0x${testAddress4}`,
        to: `0x${test04}`,
        value: 2000000000000000000,
        chainId: 1
    }
    
    const tx = new Tx(rawTx)
    const privateKeyBuffer = Buffer.from(testPrivkey4, 'hex')
    tx.sign(privateKeyBuffer)
    const serializedTx = tx.serialize()

    const txHash = await new Promise((resolve, reject) => {
        return web3.eth.sendRawTransaction(('0x' + serializedTx.toString('hex')), (e, data) => e ? reject(e) : resolve(data))
    }).catch(err => err)

    return txHash
}

setTimeout(function() {
    sendTestETH().then(result => console.log(result))
}, 2000)

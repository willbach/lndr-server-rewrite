const assert = require('assert')
const bufferUtil = require('../build/utils/buffer.util')
const testUtil = require('./util/test.util')
const ethUtil = require('ethereumjs-util')
const request = require('request-promise')

const Web3 = require('web3')
const Tx = require('ethereumjs-tx')

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const testUrl = "http://localhost:7402"
const testPrivkey0  = "7920ca01d3d1ac463dfd55b5ddfdcbb64ae31830f31be045ce2d51a305516a37"
const testPrivkey1  = "bb63b692f9d8f21f0b978b596dc2b8611899f053d68aec6c1c20d1df4f5b6ee2"
const testPrivkey2  = "2f615ea53711e0d91390e97cdd5ce97357e345e441aa95d255094164f44c8652"
const testPrivkey3  = "7d52c3f6477e1507d54a826833169ad169a56e02ffc49a1801218a7d87ca50bd"
const testPrivkey4  = "6aecd44fcb79d4b68f1ee2b2c706f8e9a0cd06b0de4729fe98cfed8886315256"
const testPrivkey5  = "686e245584fdf696abd739c0e66ac6e01fc4c68babee20c7124566e118b2a634"
const testPrivkey6  = "9fd4ab25e1699bb252f4d5c4510a135db34b3adca8baa03194ad5cd6faa13a1d"
const testPrivkey7  = "e8445efa4e3349c3c74fd6689553f93b55aca723115fb777e1e6f4db2a0a82ca"
const testPrivkey8  = "56901d80abc6953d1dc01de2f077b75260f49a3304f665b57ed13514a7e2a2bc"
const testPrivkey9  = "edc63d0e14b29aaa26c7585e962f93abb59bd7d8b01b585e073dc03d052a000b"
const testPrivkey10 = "07690ee125a0f79ed899b0f13933885048afd890d5fcb03d988a49fcfd04afc4"
const testPrivkey11 = "7784267bcfad13a4a38fddce9a5ad440ecfa4334a5c068aaac2b2edf6178c80a"
const testPrivKey12 = "f052baebb86ab89469bf07c523e6f8110740b5d5767c55e0483bd4cb3c39a60c"
const testPrivKey13 = "35107d1e6b0c78bd9ca3336235d47b3bde1109065d0535c7f6116eab2187729f"
const testAddress0  = testUtil.privateToAddress(testPrivkey0)
const testAddress1  = testUtil.privateToAddress(testPrivkey1)
const testAddress2  = testUtil.privateToAddress(testPrivkey2)
const testAddress3  = testUtil.privateToAddress(testPrivkey3)
const testAddress4  = testUtil.privateToAddress(testPrivkey4)
const testAddress5  = testUtil.privateToAddress(testPrivkey5)
const testAddress6  = testUtil.privateToAddress(testPrivkey6)
const testAddress7  = testUtil.privateToAddress(testPrivkey7)
const testAddress8  = testUtil.privateToAddress(testPrivkey8)
const testAddress9  = testUtil.privateToAddress(testPrivkey9)
const testAddress10 = testUtil.privateToAddress(testPrivkey10)
const testAddress11 = testUtil.privateToAddress(testPrivkey11)
const testAddress12 = "0x2b6F21915B54b903147544A33592F4e80f897f49"
const testAddress13 = "0x826923DEED9cA4f817a22cd6109382e8dD4A0d69"
const testSearch = "test"
const testNick1 = "test1"
const testNick2 = "test2"
const testEmail = "will@blockmason.io"

const ucacAddrAUD = '0x3599a0abda08069e8e66544a2860e628c5dc1190'
const ucacAddrCAD = '0xc40aed3a0e5a7996d11802c33190e3cc2a4be054'
const ucacAddrCHF = '0xc75dc45521f4dd3852db72a95c581b2fd89992fa'
const ucacAddrCNY = '0x6f22641557cc768057443255a9d3d0f21f8264b2'
const ucacAddrDKK = '0x449d75537c56e18c9d5e0438f7847628bbd981f7'
const ucacAddrEUR = '0xececfc5436bd8ee0c8e98379f3d99dfde6e15fb9'
const ucacAddrGBP = '0x92571ad90b03ea60419fc66353db9c39ff9db5e1'
const ucacAddrHKD = '0xb52a2db8ae67a51b1906e4b333930641d62272fd'
const ucacAddrIDR = '0xfc0f4fe61f23ca895f7e8a51d4e08462f4926687'
const ucacAddrILS = '0x77ee746c16a817109567b895ff9b9a75bf354bf4'
const ucacAddrINR = '0x24c7763f5a10370f5b431926f94daa53398182cc'
const ucacAddrJPY = '0x106c743c55d69afac2c49dae5fa9e75273c3bea4'
const ucacAddrKRW = '0xc643de39dd15b7787d1b87dd48e6e7e2b1a1f118'
const ucacAddrMYR = '0x79a5f8d6cc432c1f017648c4fae840dff4cfcaf2'
const ucacAddrNOK = '0x385540be0f17e1fae8ed83e46f5fb52545dc588b'
const ucacAddrNZD = '0xce12dfd31dbc83bd24af7fd2e193f3073e3b53ec'
const ucacAddrPLN = '0xc552e50a5829507bd575063c0c77dbee49c9fe58'
const ucacAddrRUB = '0x14eb816e20af23ef81cc1deeba71d8642edcb621'
const ucacAddrSEK = '0x6fd660b6f92395901544f637e06ca4b67a30f7c9'
const ucacAddrSGD = '0x3ac772c0f927df3c07cd90c17b536fcab86e0a53'
const ucacAddrTHB = '0x9a76e6a7a56b72d8750f00240363dc06d09c7161'
const ucacAddrTRY = '0xfe2bbfbe30f835096ccbc9c12a38ac749d8402b2'
const ucacAddr = '0x6804f48233f6ff2b468f7636560d525ca951931e'
const ucacAddrVND = '0x815dcbb2008757a469d0daf8c310fae2fc41e96b'

describe('Settlement Tests', function() {

  describe('Basic Settlement Test', function() {
    const settlementCredit = { creditor: testAddress5, debtor: testAddress6, amount: 2939, memo: 'ETH test settlement', submitter: testAddress5, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined }
  
    const settlementBuffer = Buffer.concat([
      testUtil.hexToBuffer(settlementCredit.ucac),
      testUtil.hexToBuffer(settlementCredit.creditor),
      testUtil.hexToBuffer(settlementCredit.debtor),
      testUtil.int32ToBuffer(settlementCredit.amount),
      testUtil.int32ToBuffer(settlementCredit.nonce)
    ])
    settlementCredit.hash = testUtil.bufferToHex(ethUtil.sha3(settlementBuffer))
    settlementCredit.signature = testUtil.mobileSign(settlementCredit, testPrivkey5)

    let settleAmount = 0
    // user5 submits pending settlement credit to user6
    it('POST /lend should be successful', function(done) {
      const options = {
        method: 'POST',
        uri: 'http://localhost:7402/lend',
        body: settlementCredit,
        json: true // Automatically stringifies the body to JSON
      }
      request(options).then(response => {
        console.log(response)
        done()
      })
    })
  
    it('GET /pending_settlements should have 1 pending settlement for user 5', function(done) {
      const options = {
        uri: 'http://localhost:7402/pending_settlements/' + testAddress5,
        json: true // Automatically stringifies the body to JSON
      }
      request(options).then(res => {
        assert.equal(res.unilateralSettlements.length, 1)
        assert.equal(res.bilateralSettlements.length, 0)
        done()
      })
    })
  
    it('POST /lend should be successful', function(done) {
      settlementCredit.submitter = testAddress6
      settlementCredit.signature = testUtil.mobileSign(settlementCredit, testPrivkey6)
  
      const options = {
        method: 'POST',
        uri: 'http://localhost:7402/lend',
        body: settlementCredit,
        json: true // Automatically stringifies the body to JSON
      }
      request(options).then(response => {
        assert.equal(response, undefined)
        done()
      })
    })
  
    it('GET /pending_settlements should have 1 pending settlement for user 6', function(done) {
      const options = {
        uri: 'http://localhost:7402/pending_settlements/' + testAddress5,
        json: true // Automatically stringifies the body to JSON
      }
      request(options).then(res => {
        assert.equal(res.unilateralSettlements.length, 0)
        assert.equal(res.bilateralSettlements.length, 1)
        settleAmount = res.bilateralSettlements[0].creditRecord.settlementAmount
        console.log('SETTLEMENT AMOUNT', settleAmount)
        done()
      })
    })
  
    it('should confirm that ETH was sent and then verify the settlement', async() => {
      const nonce = await new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(`0x${testAddress5}`, (e, data) => e ? reject(e) : resolve(data))
      })
  
      var rawTx = {
        nonce,
        gasPrice: 20000,
        gasLimit: 21000,
        from: `0x${testAddress5}`,
        to: `0x${testAddress6}`,
        value: settleAmount,
        chainId: 1
      }
  
      var tx = new Tx(rawTx)
      tx.sign(Buffer.from(testPrivkey5, 'hex'))
      var serializedTx = tx.serialize()
  
      const txHash = await new Promise((resolve, reject) => {
          web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, data) {
              if (err) {
                  reject(err)
              } else {
                  resolve(data)
              }
          })
      })
  
      // send the tx hash
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(settlementCredit.hash),
        testUtil.hexToBuffer(txHash),
        testUtil.hexToBuffer(testAddress5)
      ])
      const newHash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      const signature = testUtil.serverSign(newHash, testPrivkey5)
      const verifySettlementRequest = { creditHash: settlementCredit.hash, txHash, creditorAddress: testAddress5, signature }
  
      const options = {
        method: 'POST',
        uri: 'http://localhost:7402/verify_settlement',
        body: verifySettlementRequest,
        json: true // Automatically stringifies the body to JSON
      }
  
      request(options).then(data => {
        assert.equal(data, undefined)
      }).catch(err => console.log(err))
  
      // get pending here
      setTimeout(function() {
        const options1 = {
          uri: 'http://localhost:7402/pending_settlements/' + testAddress5,
          json: true // Automatically stringifies the body to JSON
        }
        request(options1).then(res => {
          console.log('SHOULD BE 0', res)
          assert.equal(res.unilateralSettlements.length, 0)
          assert.equal(res.bilateralSettlements.length, 0)
        })
  
        const options2 = {
          uri: 'http://localhost:7402/balance/' + testAddress5 + '?currency=USD',
          json: true // Automatically stringifies the body to JSON
        }
        request(options2).then(res => {
          assert.equal(res, 2939)
        })
  
        const options3 = {
          uri: 'http://localhost:7402/balance/' + testAddress5 + '/' + testAddress6 + '?currency=USD',
          json: true // Automatically stringifies the body to JSON
        }
        request(options3).then(res => {
          assert.equal(res, 2939)
        })
  
        const options4 = {
          uri: 'http://localhost:7402/balance/' + testAddress6 + '?currency=USD',
          json: true // Automatically stringifies the body to JSON
        }
        request(options4).then(res => {
          assert.equal(res, -2939)
        })
  
        const options5 = {
          uri: 'http://localhost:7402/balance/' + testAddress6 + '/' + testAddress5 + '?currency=USD',
          json: true // Automatically stringifies the body to JSON
        }
        request(options5).then(res => {
          assert.equal(res, -2939)
        })
  
        const options6 = {
          uri: 'http://localhost:7402/tx_hash/' + settlementCredit.hash,
          json: true // Automatically stringifies the body to JSON
        }
        return request(options6).then(res => {
          assert.equal(res, txHash.slice(2))
        })
  
      }, 5000)
    })
  
    xdescribe('DAI Settlement Test', function() {
      //copy from above
    })
  
    xdescribe('Multi Settlement', function() {
      const settlementCredit1 = { creditor: testAddress9, debtor: testAddress0, amount: 2939, memo: 'advanced settlement 1', submitter: testAddress9, nonce: 0, hash: "", signature: "", ucac:ucacAddrJPY, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined }
      const settlementCredit2 = { creditor: testAddress0, debtor: testAddress9, amount: 1939, memo: 'advanced settlement 2', submitter: testAddress9, nonce: 1, hash: "", signature: "", ucac:ucacAddrJPY, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined }
  
      let settleAmount1 = 0, settleAmount2 = 0
      
      it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1', function(done) {
        settlementCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit1.hash)], testPrivkey9)
        settlementCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit2.hash)], testPrivkey9)
        request(server).post('/multi_settlement').send([settlementCredit1, settlementCredit2]).expect(204, done)
      })
  
      it('GET /pending_settlements should have 1 pending settlement for user 5', function(done) {
        request(server).get('/pending_settlements/' + testAddress9).expect(200).then((res) => {
          assert.equal(res.body.pendingSettlements.length, 2)
          assert.equal(res.body.bilateralPendingSettlements.length, 0)
          done()
        })
      })
  
      it('POST /multi_settlement should return 204 for a successful multi credit submission from user 2', function(done) {
        settlementCredit1.submitter = testAddress0
        settlementCredit2.submitter = testAddress0
        settlementCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit1.hash)], testPrivkey0)
        settlementCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit2.hash)], testPrivkey0)
        request(server).post('/multi_settlement').send([settlementCredit1, settlementCredit2]).expect(204, done)
      })
  
      it('GET /pending_settlements should have 2 bilateral pending settlements for user 9', function(done) {
        request(server).get('/pending_settlements/' + testAddress9).expect(200).then((res) => {
          assert.equal(res.body.pendingSettlements.length, 0)
          assert.equal(res.body.bilateralPendingSettlements.length, 2)
          settleAmount1 = res.body.bilateralPendingSettlements[0].settlementAmount
          settleAmount2 = res.body.bilateralPendingSettlements[1].settlementAmount
          done()
        })
      })
  
        // user5 transfers eth to user6
        // txHashE <- runWeb3 $ Eth.sendTransaction $ Call (Just testAddress9)
        //                                                     testAddress0
        //                                                     (Just 21000)
        //                                                     Nothing
        //                                                     settleAmount
        //                                                     Nothing
  
        // let txHash = fromRight (error "error sending eth") txHashE
  
        // httpCode <- getTxHashFail testUrl creditHash
        // assertEqual "404 upon hash not found error" 404 httpCode
  
        // // user5 verifies that he has made the settlement credit
        // httpCode <- verifySettlement testUrl creditHash txHash testPrivkey5
        // assertEqual "verification success" 204 httpCode
  
        // // ensure that tx registers in blockchain w/ a 10 second pause and
        // // heartbeat has time to verify its validity
        // threadDelay (20 * 10 ^ 6)
  
        // (SettlementsResponse pendingSettlements bilateralPendingSettlements) <- getPendingSettlements testUrl testAddress5
        // assertEqual "post-verification: get pending settlements success" 0 (length pendingSettlements)
        // assertEqual "post-verification: get bilateral pending settlements success" 0 (length bilateralPendingSettlements)
  
        // balance <- getBalance testUrl testAddress5 "USD"
        // assertEqual "user5's total balance is correct" testAmount balance
  
        // balance <- getBalance testUrl testAddress6 "USD"
        // assertEqual "user5's total balance is correct" (-testAmount) balance
  
        // gottenTxHash <- getTxHash testUrl creditHash
        // assertEqual "successful txHash retrieval" txHash (addHexPrefix gottenTxHash)
    })
  })
})

// const daiAddress = 'f5cad0db6415a71a5bc67403c87b56b629b4ddaa'

// const daiContract = web3.eth.contract(ERC20_ABI).at(`0x${daiAddress}`)

// const nonce = await new Promise((resolve, reject) => {
//   web3.eth.getTransactionCount(`0x${testAddress3}`, (e, data) => e ? reject(e) : resolve(data))
// })

// const txData = daiContract.transfer.getData(`0x${settlementCredit.debtor}`, settleAmount)

// var rawTx = {
//   nonce,
//   gasPrice: 20000,
//   gasLimit: 210000,
//   from: `0x${testAddress3}`,
//   to: `0x${daiAddress}`,
//   value: 0,
//   data: txData,
//   chainId: 1
// }

// const tx = new Tx(rawTx)
// tx.sign(Buffer.from(testPrivkey3, 'hex'))
// const serializedTx = tx.serialize()

// const txHash = await new Promise((resolve, reject) => {
//   web3.eth.sendRawTransaction(('0x' + serializedTx.toString('hex')), (e, data) => e ? reject(e) : resolve(data))
// })

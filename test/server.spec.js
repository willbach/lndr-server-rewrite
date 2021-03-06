const assert = require('assert')
const request = require('supertest')
const server = require('../lib/server.js')
const bufferUtil = require('../lib/utils/buffer.util')
const testUtil = require('./util/test.util')
const ethUtil = require('ethereumjs-util')
const CreditRecord = require('../lib/dto/credit-record')

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

describe('LNDR Server', function() {
  describe('Nicknames and Friends', function() {
    it('GET /user?nick= should respond with 404 if nick is not taken', function(done) {
      request(server).get('/user?nick=' + testNick1).expect(404, done)
    })

    it('POST /nick should store the nickname', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(testAddress3),
        testUtil.utf8ToBuffer(testNick1)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      const signature = testUtil.serverSign(hash, testPrivkey3)

      const nickRequest = {
        addr: testAddress3,
        nick: testNick1,
        signature: signature
      }

      request(server).post('/nick').send(nickRequest).expect(204, done)
    })

    it('GET /user?nick= should respond with 200 if nick is taken', function(done) {
      request(server).get('/user?nick=' + testNick1).expect(200, done)
    })

    it('GET /nick should respond with the correct nickname for the given address', function(done) {
      request(server).get('/nick/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body, testNick1)
        done()
      })
    })

    it('POST /nick should fail if nick is already taken', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(testAddress4),
        testUtil.utf8ToBuffer(testNick1)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      const signature = testUtil.serverSign(hash, testPrivkey4)

      const nickRequest = {
        addr: testAddress4,
        nick: testNick1,
        signature: signature
      }

      request(server).post('/nick').send(nickRequest).expect(400, done)
    })

    it('POST /nick should succeed when changing nick', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(testAddress3),
        testUtil.utf8ToBuffer(testNick2)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      const signature = testUtil.serverSign(hash, testPrivkey3)

      const nickRequest = {
        addr: testAddress3,
        nick: testNick2,
        signature: signature
      }

      request(server).post('/nick').send(nickRequest).expect(204, done)
    })

    it('GET /nick should confirm that nick was changed', function(done) {
      request(server).get('/nick/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body, testNick2)
        done()
      })
    })

    it('POST /nick should allow new user to use discarded nick', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(testAddress4),
        testUtil.utf8ToBuffer(testNick1)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      const signature = testUtil.serverSign(hash, testPrivkey4)

      const nickRequest = {
        addr: testAddress4,
        nick: testNick1,
        signature: signature
      }

      request(server).post('/nick').send(nickRequest).expect(204, done)
    })

    it('GET /nick should return fuzzy search results for both nicks', function(done) {
      request(server).get('/search_nick/' + testSearch).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    it('POST /add_friends should allow a user to send a friend request', function(done) {
      request(server).post('/add_friends/' + testAddress3).send([testAddress4]).expect(204, done)
    })

    it('GET /friends should return an empty list for user 1', function(done) {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friends should return an empty list for user 2', function(done) {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friend_requests should return a pending from user 1', function(done) {
      request(server).get('/friend_requests/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].addr, testAddress3)
        done()
      })
    })

    it('GET /friend_requests should not return a pending from user 2', function(done) {
      request(server).get('/friend_requests/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /outbound_friend_requests should not return a pending from user 2', function(done) {
      request(server).get('/outbound_friend_requests/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /outbound_friend_requests should return a pending outbound from user 1', function(done) {
      request(server).get('/outbound_friend_requests/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].addr, testAddress4)
        done()
      })
    })

    it('POST /add_friends should create a friendship once both parties have confirmed', function(done) {
      request(server).post('/add_friends/' + testAddress4).send([testAddress3]).expect(204, done)
    })

    it('GET /friends should return a list containing user 2 for user 1', function(done) {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].addr, testAddress4)
        done()
      })
    })

    it('GET /friends should return a list containing user 1 for user 2', function(done) {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].addr, testAddress3)
        done()
      })
    })

    it('POST /remove_friends should remove two users as friends if user 1 removes user 2', function(done) {
       request(server).post('/remove_friends/' + testAddress3).send([testAddress4]).expect(204, done)
    })

    it('GET /friends should return an empty list for user 1', function(done) {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friends should return an empty list for user 2', function(done) {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friend_requests should not return a pending from user 2', function(done) {
      request(server).get('/friend_requests/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friend_requests should not return a pending from user 1', function(done) {
      request(server).get('/friend_requests/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /user?email= should respond with 404 if email is not taken', function(done) {
      request(server).get('/user?email=' + testEmail).expect(404, done)
    })

    it('POST /email should set the email for a given user', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(testAddress3),
        testUtil.utf8ToBuffer(testEmail)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      const signature = testUtil.serverSign(hash, testPrivkey3)
      // set email for user1
      const emailRequest = {
        addr: testAddress3,
        email: testEmail,
        signature: signature
      }
      
      request(server).post('/email').send(emailRequest).expect(204, done)
    })

    it('GET /user?email= should respond with 200 now that email is taken', function(done) {
      request(server).get('/user?email=' + testEmail).expect(200, done)
    })

    it('should check that email for user3 properly set', function(done) {
      request(server).get('/email/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body, testEmail)
        done()
      })
    })
  })

  describe('Notifications', function() {
    describe('Basic Notifications Test', function() {
      //     [ testCase "registerChannel" basicNotificationsTest

      const testPush = {
        channelID: "31279004-103e-4ba8-b4bf-65eb3eb81859",
        platform: 'ios',
        address: testAddress1,
        signature: ''
      }

      it('POST /register_push should correctly register the push ID', function(done) {
        const hashBuffer = Buffer.concat([
          testUtil.utf8ToBuffer(testPush.platform),
          testUtil.utf8ToBuffer(testPush.channelID),
          testUtil.hexToBuffer(testPush.address)
        ])
        const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
        testPush.signature = testUtil.serverSign(hash, testPrivkey1)

        request(server).post('/register_push').send(testPush).expect(204, done)
      })

      it('POST /register_push should register twice with the same address and device', function(done) {
        const hashBuffer = Buffer.concat([
          testUtil.utf8ToBuffer(testPush.platform),
          testUtil.utf8ToBuffer(testPush.channelID),
          testUtil.hexToBuffer(testPush.address)
        ])
        const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
        testPush.signature = testUtil.serverSign(hash, testPrivkey1)

        request(server).post('/register_push').send(testPush).expect(204, done)
      })

      it('POST /register_push should register twice with new address but same device', function(done) {
        testPush.address = testAddress2
        const hashBuffer = Buffer.concat([
          testUtil.utf8ToBuffer(testPush.platform),
          testUtil.utf8ToBuffer(testPush.channelID),
          testUtil.hexToBuffer(testPush.address)
        ])
        const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
        testPush.signature = testUtil.serverSign(hash, testPrivkey2)

        request(server).post('/register_push').send(testPush).expect(204, done)
      })

      it('POST /register_push should correctly register with a new address and device', function(done) {
        testPush.address = testAddress2
        testPush.channelID = "79312004-103e-4ba8-b4bf-65eb3eb59818"
        testPush.platform = 'android'
        
        const hashBuffer = Buffer.concat([
          testUtil.utf8ToBuffer(testPush.platform),
          testUtil.utf8ToBuffer(testPush.channelID),
          testUtil.hexToBuffer(testPush.address)
        ])
        const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
        testPush.signature = testUtil.serverSign(hash, testPrivkey2)

        request(server).post('/register_push').send(testPush).expect(204, done)
      })
    })

    describe('Delete Notifications ID Test', function() {
      const testPush = {
        channelID: "31279004-103e-4ba8-b4bf-65eb3eb81859",
        platform: 'ios',
        address: testAddress1,
        signature: ''
      }

      it('POST /unregister_push should delete the db entry for that channelID', function(done) {
        const hashBuffer = Buffer.concat([
          testUtil.utf8ToBuffer(testPush.platform),
          testUtil.utf8ToBuffer(testPush.channelID),
          testUtil.hexToBuffer(testPush.address)
        ])
        const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
        testPush.signature = testUtil.serverSign(hash, testPrivkey1)

        request(server).post('/unregister_push').send(testPush).expect(204, done)
      })
    })
  })

  describe('PayPal Requests Test', function() {
    const paypalRequest = {
      friend: testAddress2,
      requestor: testAddress1,
      paypalRequestSignature: ''
    }

    it('POST /request_paypal should create a paypal request', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(paypalRequest.friend),
        testUtil.hexToBuffer(paypalRequest.requestor)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      paypalRequest.paypalRequestSignature = testUtil.serverSign(hash, testPrivkey1)

      request(server).post('/request_paypal').send(paypalRequest).expect(204, done)
    })

    it('GET /request_paypal returns a list of requests for user 2', function(done) {
      request(server).get('/request_paypal/' + testAddress2).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        done()
      })
    })

    it('GET /request_paypal returns a list of requests for user 1', function(done) {
      request(server).get('/request_paypal/' + testAddress1).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        done()
      })
    })

    it('POST /remove_paypal_request should remove a paypal request', function(done) {
      const hashBuffer = Buffer.concat([
        testUtil.hexToBuffer(paypalRequest.friend),
        testUtil.hexToBuffer(paypalRequest.requestor)
      ])
      const hash = testUtil.bufferToHex(ethUtil.sha3(hashBuffer))
      paypalRequest.paypalRequestSignature = testUtil.serverSign(hash, testPrivkey1)

      request(server).post('/remove_paypal_request').send(paypalRequest).expect(204, done)
    })

    it('GET /request_paypal returns an empty list for user 2', function(done) {
      request(server).get('/request_paypal/' + testAddress2).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /request_paypal returns an empty list for user 1', function(done) {
      request(server).get('/request_paypal/' + testAddress1).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })
  })

  describe('Credits', function() {
    describe('Basic Credit Test', function() {
      // (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrPLN, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND) <- loadUcacs

      const usdCredit = { creditor: testAddress1, debtor: testAddress2, amount: 100, memo: "USD test 1", submitter: testAddress1, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }
      const badCredit = { creditor: testAddress1, debtor: testAddress1, amount: 100, memo: "bad test", submitter: testAddress1, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }

      const usdBuffer = Buffer.concat([
        testUtil.hexToBuffer(usdCredit.ucac),
        testUtil.hexToBuffer(usdCredit.creditor),
        testUtil.hexToBuffer(usdCredit.debtor),
        testUtil.int32ToBuffer(usdCredit.amount),
        testUtil.int32ToBuffer(usdCredit.nonce)
      ])
      usdCredit.hash = testUtil.bufferToHex(ethUtil.sha3(usdBuffer))
      usdCredit.signature = testUtil.signCredit(usdCredit, testPrivkey1)

      const badBuffer = Buffer.concat([
        testUtil.hexToBuffer(badCredit.ucac),
        testUtil.hexToBuffer(badCredit.creditor),
        testUtil.hexToBuffer(badCredit.debtor),
        testUtil.int32ToBuffer(badCredit.amount),
        testUtil.int32ToBuffer(badCredit.nonce)
      ])
      badCredit.hash = testUtil.bufferToHex(ethUtil.sha3(badBuffer))
      badCredit.signature = testUtil.signCredit(badCredit, testPrivkey1)

      // testCase "lend money to friend" basicLendTest
      // user1 fails to submit pending credit to himself
      it('POST /lend should fail if creditor and debtor are the same', function(done) {
        request(server).post('/lend').send(badCredit).expect(400, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('GET /pending should return 1 record for user 1', function(done) {
        request(server).get('/pending/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /pending should return 1 record for user 2', function(done) {
        request(server).get('/pending/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('POST /reject user 2 should reject credit from user 1', function(done) {
        const rejectRequest = { hash: usdCredit.hash, signature: testUtil.serverSign(usdCredit.hash, testPrivkey2) }
        request(server).post('/reject').send(rejectRequest).expect(204, done)
      })

      it('GET /pending should return 0 records for user 2', function(done) {
        request(server).get('/pending/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function(done) {
        usdCredit.submitter = testAddress2
        usdCredit.signature = testUtil.signCredit(usdCredit, testPrivkey2)

        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('GET /pending should return 0 records for user 1', function(done) {
        request(server).get('/pending/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('GET /transactions should return 1 record for user 1', function(done) {
        request(server).get('/transactions?user=' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 1', function(done) {
        request(server).get('/balance/' + testAddress1 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 1 and user 2', function(done) {
        request(server).get('/balance/' + testAddress1 + '/' + testAddress2 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 2', function(done) {
        request(server).get('/balance/' + testAddress2 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 2 and user 1', function(done) {
        request(server).get('/balance/' + testAddress2 + '/' + testAddress1 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /counterparties for user 1 should include user 2', function(done) {
        request(server).get('/counterparties/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body[0], testAddress2)
          done()
        })
      })

      it('GET /counterparties for user 2 should include user 1', function(done) {
        request(server).get('/counterparties/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body[0], testAddress1)
          done()
        })
      })

      it('GET /friends should return a list containing user 2 for user 1', function(done) {
        request(server).get('/friends/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          assert.equal(res.body[0].addr, testAddress2)
          done()
        })
      })
  
      it('GET /friends should return a list containing user 1 for user 2', function(done) {
        request(server).get('/friends/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          assert.equal(res.body[0].addr, testAddress1)
          done()
        })
      })

      const jpyCredit = { creditor: testAddress1, debtor: testAddress2, amount: 20000, memo: "JPY test 1", submitter: testAddress2, nonce: 1, hash: "", signature: "", ucac: ucacAddrJPY, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }

      const jpyBuffer = Buffer.concat([
        testUtil.hexToBuffer(jpyCredit.ucac),
        testUtil.hexToBuffer(jpyCredit.creditor),
        testUtil.hexToBuffer(jpyCredit.debtor),
        testUtil.int32ToBuffer(jpyCredit.amount),
        testUtil.int32ToBuffer(jpyCredit.nonce)
      ])
      jpyCredit.hash = testUtil.bufferToHex(ethUtil.sha3(jpyBuffer))
      jpyCredit.signature = testUtil.signCredit(jpyCredit, testPrivkey2)

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        request(server).post('/borrow').send(jpyCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function(done) {
        jpyCredit.submitter = testAddress1
        jpyCredit.signature = testUtil.signCredit(jpyCredit, testPrivkey1)
        request(server).post('/lend').send(jpyCredit).expect(204, done)
      })

      it('GET /balance should return the correct JPY amount for user 2', function(done) {
        request(server).get('/balance/' + testAddress2 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, -20000)
          done()
        })
      })

      it('GET /balance should return the correct JPY balance between user 2 and user 1', function(done) {
        request(server).get('/balance/' + testAddress2 + '/' + testAddress1 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, -20000)
          done()
        })
      })
    })

    describe('PayPal Settlement Test', function() {
      const paypalCredit = { creditor: testAddress10, debtor: testAddress11, amount: 100, memo: "paypal test", submitter: testAddress10, nonce: 0, hash: "", signature: "", ucac: ucacAddrJPY, settlementCurrency: 'PAYPAL', settlementAmount: undefined, settlementBlocknumber: undefined }

      const paypalBuffer = Buffer.concat([
        testUtil.hexToBuffer(paypalCredit.ucac),
        testUtil.hexToBuffer(paypalCredit.creditor),
        testUtil.hexToBuffer(paypalCredit.debtor),
        testUtil.int32ToBuffer(paypalCredit.amount),
        testUtil.int32ToBuffer(paypalCredit.nonce)
      ])
      paypalCredit.hash = testUtil.bufferToHex(ethUtil.sha3(paypalBuffer))
      paypalCredit.signature = testUtil.signCredit(paypalCredit, testPrivkey10)

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        request(server).post('/lend').send(paypalCredit).expect(204, done)
      })

      it('GET /pending should return 1 record for user 1', function(done) {
        request(server).get('/pending/' + testAddress10).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /pending should return 1 record for user 2', function(done) {
        request(server).get('/pending/' + testAddress11).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('POST /reject user 2 should reject credit from user 1', function(done) {
        const rejectRequest = { hash: paypalCredit.hash, signature: testUtil.serverSign(paypalCredit.hash, testPrivkey11) }
        request(server).post('/reject').send(rejectRequest).expect(204, done)
      })

      it('GET /pending should return 0 records for user 2', function(done) {
        request(server).get('/pending/' + testAddress11).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        request(server).post('/lend').send(paypalCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function(done) {
        paypalCredit.submitter = testAddress11
        paypalCredit.signature = testUtil.signCredit(paypalCredit, testPrivkey11)
        request(server).post('/borrow').send(paypalCredit).expect(204, done)
      })

      it('GET /pending should return 0 records for user 1', function(done) {
        request(server).get('/pending/' + testAddress10).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('GET /transactions should return 1 record for user 1', function(done) {
        request(server).get('/transactions?user=' + testAddress10).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 1', function(done) {
        request(server).get('/balance/' + testAddress10 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 1 and user 2', function(done) {
        request(server).get('/balance/' + testAddress10 + '/' + testAddress11 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 2', function(done) {
        request(server).get('/balance/' + testAddress11 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 2 and user 1', function(done) {
        request(server).get('/balance/' + testAddress11 + '/' + testAddress10 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })
    })
  })

  describe('Multi Transaction', function() {
    //     [ testCase "multiSettlementLendTest" multiSettlementLendTest
    const krwCredit1 = { creditor: testAddress8, debtor: testAddress7, amount: 100, memo: "KRW multitest", submitter: testAddress7, nonce: 0, hash: "", signature: "", ucac: ucacAddrKRW, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }
    const krwCredit2 = { creditor: testAddress7, debtor: testAddress8, amount: 50, memo: "KRW multitest", submitter: testAddress7, nonce: 1, hash: "", signature: "", ucac: ucacAddrKRW, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }

    const buffer1 = Buffer.concat([
      testUtil.hexToBuffer(krwCredit1.ucac),
      testUtil.hexToBuffer(krwCredit1.creditor),
      testUtil.hexToBuffer(krwCredit1.debtor),
      testUtil.int32ToBuffer(krwCredit1.amount),
      testUtil.int32ToBuffer(krwCredit1.nonce),
    ])
    krwCredit1.hash = testUtil.bufferToHex(ethUtil.sha3(buffer1))
    krwCredit1.signature = testUtil.signCredit(krwCredit1, testPrivkey7)

    const buffer2 = Buffer.concat([
      testUtil.hexToBuffer(krwCredit2.ucac),
      testUtil.hexToBuffer(krwCredit2.creditor),
      testUtil.hexToBuffer(krwCredit2.debtor),
      testUtil.int32ToBuffer(krwCredit2.amount),
      testUtil.int32ToBuffer(krwCredit2.nonce),
    ])
    krwCredit2.hash = testUtil.bufferToHex(ethUtil.sha3(buffer2))
    krwCredit2.signature = testUtil.signCredit(krwCredit2, testPrivkey7)

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1', function(done) {
      this.timeout(8000)
      request(server).post('/multi_settlement').send([krwCredit1, krwCredit2]).expect(204, done)
    })

    it('GET /pending should return 2 records for user 1', function(done) {
      request(server).get('/pending/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    it('GET /pending should return 2 records for user 2', function(done) {
      request(server).get('/pending/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    it('POST /reject user 2 should reject credit1 from user 1', function(done) {
      const rejectRequest = { hash: krwCredit1.hash, signature: testUtil.serverSign(krwCredit1.hash, testPrivkey8) }
      request(server).post('/reject').send(rejectRequest).expect(204, done)
    })

    it('POST /reject user 2 should reject credit2 from user 1', function(done) {
      const rejectRequest = { hash: krwCredit2.hash, signature: testUtil.serverSign(krwCredit2.hash, testPrivkey8) }
      request(server).post('/reject').send(rejectRequest).expect(204, done)
    })

    it('GET /pending should return 0 records for user 2', function(done) {
      request(server).get('/pending/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1 (2nd time)', function(done) {
      this.timeout(8000)
      request(server).post('/multi_settlement').send([krwCredit1, krwCredit2]).expect(204, done)
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 2', function(done) {
      this.timeout(8000)
      krwCredit1.submitter = testAddress8
      krwCredit1.signature = testUtil.signCredit(krwCredit1, testPrivkey8)
      krwCredit2.submitter = testAddress8
      krwCredit2.signature = testUtil.signCredit(krwCredit2, testPrivkey8)
      request(server).post('/multi_settlement').send([krwCredit1, krwCredit2]).expect(204, done)
    })

    it('GET /pending should return 0 records for user 1', function(done) {
      request(server).get('/pending/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /transactions should return 2 records for user 1', function(done) {
      request(server).get('/transactions?user=' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    it('GET /balance should return the correct amount for user 1', function(done) {
      request(server).get('/balance/' + testAddress7 + '?currency=KRW').expect(200).then((res) => {
        assert.equal(res.body, -50)
        done()
      })
    })

    it('GET /balance should return the correct balance between user 1 and user 2', function(done) {
      request(server).get('/balance/' + testAddress7 + '/' + testAddress8 + '?currency=KRW').expect(200).then((res) => {
        assert.equal(res.body, -50)
        done()
      })
    })

    it('GET /balance should return the correct amount for user 2', function(done) {
      request(server).get('/balance/' + testAddress8 + '?currency=KRW').expect(200).then((res) => {
        assert.equal(res.body, 50)
        done()
      })
    })

    it('GET /balance should return the correct balance between user 2 and user 1', function(done) {
      request(server).get('/balance/' + testAddress8 + '/' + testAddress7 + '?currency=KRW').expect(200).then((res) => {
        assert.equal(res.body, 50)
        done()
      })
    })

    it('GET /counterparties for user 1 should include user 2', function(done) {
      request(server).get('/counterparties/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body[0], testAddress8)
        done()
      })
    })

    it('GET /counterparties for user 2 should include user 1', function(done) {
      request(server).get('/counterparties/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body[0], testAddress7)
        done()
      })
    })

    it('GET /friends should return a list containing user 2 for user 1', function(done) {
      request(server).get('/friends/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].addr, testAddress8)
        done()
      })
    })

    it('GET /friends should return a list containing user 1 for user 2', function(done) {
      request(server).get('/friends/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].addr, testAddress7)
        done()
      })
    })
  })
})

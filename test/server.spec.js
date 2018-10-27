const assert = require('assert')
const request = require('supertest')
const server = require('../build/server.js')
const bufferUtil = require('../build/utils/buffer.util')
const testUtil = require('./util/test.util')
const ethUtil = require('ethereumjs-util')
const CreditRecord = require('../build/dto/credit-record')

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

// loadUcacs = do
//     (ConfigResponse ucacAddresses _ _ _ _) <- getConfig testUrl
//     let Just ucacAddrAUD = M.lookup "AUD" ucacAddresses
//         Just ucacAddrCAD = M.lookup "CAD" ucacAddresses
//         Just ucacAddrCHF = M.lookup "CHF" ucacAddresses
//         Just ucacAddrCNY = M.lookup "CNY" ucacAddresses
//         Just ucacAddrDKK = M.lookup "DKK" ucacAddresses
//         Just ucacAddrEUR = M.lookup "EUR" ucacAddresses
//         Just ucacAddrGBP = M.lookup "GBP" ucacAddresses
//         Just ucacAddrHKD = M.lookup "HKD" ucacAddresses
//         Just ucacAddrIDR = M.lookup "IDR" ucacAddresses
//         Just ucacAddrILS = M.lookup "ILS" ucacAddresses
//         Just ucacAddrINR = M.lookup "INR" ucacAddresses
//         Just ucacAddrJPY = M.lookup "JPY" ucacAddresses
//         Just ucacAddrKRW = M.lookup "KRW" ucacAddresses
//         Just ucacAddrMYR = M.lookup "MYR" ucacAddresses
//         Just ucacAddrNOK = M.lookup "NOK" ucacAddresses
//         Just ucacAddrNZD = M.lookup "NZD" ucacAddresses
//         Just ucacAddrPLN = M.lookup "PLN" ucacAddresses
//         Just ucacAddrRUB = M.lookup "RUB" ucacAddresses
//         Just ucacAddrSEK = M.lookup "SEK" ucacAddresses
//         Just ucacAddrSGD = M.lookup "SGD" ucacAddresses
//         Just ucacAddrTHB = M.lookup "THB" ucacAddresses
//         Just ucacAddrTRY = M.lookup "TRY" ucacAddresses
//         Just ucacAddr = M.lookup "USD" ucacAddresses
//         Just ucacAddrVND = M.lookup "VND" ucacAddresses
//     return (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrPLN, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND)


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
        assert.equal(res.body.nickname, testNick1)
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
        assert.equal(res.body.nickname, testNick2)
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
        assert.equal(res.body[0].address, testAddress3)
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
        assert.equal(res.body[0].address, testAddress4)
        done()
      })
    })

    it('POST /add_friends should create a friendship once both parties have confirmed', function(done) {
      request(server).post('/add_friends/' + testAddress4).send([testAddress3]).expect(204, done)
    })

    it('GET /friends should return a list containing user 2 for user 1', function(done) {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress4)
        done()
      })
    })

    it('GET /friends should return a list containing user 1 for user 2', function(done) {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress3)
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
        assert.equal(res.body.email, testEmail)
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
      usdCredit.signature = testUtil.mobileSign(usdCredit, testPrivkey1)

      const badBuffer = Buffer.concat([
        testUtil.hexToBuffer(badCredit.ucac),
        testUtil.hexToBuffer(badCredit.creditor),
        testUtil.hexToBuffer(badCredit.debtor),
        testUtil.int32ToBuffer(badCredit.amount),
        testUtil.int32ToBuffer(badCredit.nonce)
      ])
      badCredit.hash = testUtil.bufferToHex(ethUtil.sha3(badBuffer))
      badCredit.signature = testUtil.mobileSign(badCredit, testPrivkey1)

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
        usdCredit.signature = testUtil.mobileSign(usdCredit, testPrivkey2)

        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('GET /pending should return 0 records for user 1', function(done) {
        request(server).get('/pending/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('GET /transactions should return 1 record for user 1', function(done) {
        request(server).get('/transactions/' + testAddress1).expect(200).then((res) => {
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
          assert.equal(res.body[0].address, testAddress2)
          done()
        })
      })
  
      it('GET /friends should return a list containing user 1 for user 2', function(done) {
        request(server).get('/friends/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          assert.equal(res.body[0].address, testAddress1)
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
      jpyCredit.signature = testUtil.mobileSign(jpyCredit, testPrivkey2)

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        request(server).post('/lend').send(jpyCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function(done) {
        jpyCredit.submitter = testAddress1
        jpyCredit.signature = testUtil.mobileSign(jpyCredit, testPrivkey1)
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

    xdescribe('Basic Settlement Test', function() {
      const settlementCredit = { creditor: testAddress5, debtor: testAddress6, amount: 2939, memo: 'test settlement', submitter: testAddress5, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined }

      let settleAmount = 0
      // user5 submits pending settlement credit to user6
      it('POST /lend should be successful', function(done) {
        settlementCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit.hash)], testPrivkey5)
        request(server).post('/lend').send(settlementCredit).expect(204, done)
      })

      it('GET /pending_settlements should have 1 pending settlement for user 5', function(done) {
        request(server).get('/pending_settlements/' + testAddress5).expect(200).then((res) => {
          assert.equal(res.body.pendingSettlements.length, 1)
          assert.equal(res.body.bilateralPendingSettlements.length, 0)
          done()
        })
      })

      it('POST /lend should be successful', function(done) {
        settlementCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit.hash)], testPrivkey6)
        request(server).post('/lend').send(settlementCredit).expect(204, done)
      })

      it('GET /pending_settlements should have 1 pending settlement for user 5', function(done) {
        request(server).get('/pending_settlements/' + testAddress5).expect(200).then((res) => {
          assert.equal(res.body.pendingSettlements.length, 0)
          assert.equal(res.body.bilateralPendingSettlements.length, 1)
          settleAmount = res.body.bilateralPendingSettlements[0].settlementAmount
          done()
        })
      })

      // user5 transfers eth to user6
      // txHashE <- runWeb3 $ Eth.sendTransaction $ Call (Just testAddress5)
      //                                                     testAddress6
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

    xdescribe('DAI Settlement Test', function() {
      //copy from above
    })

    xdescribe('PayPal Settlement Test', function() {
      const paypalCredit = { creditor: testAddress10, debtor: testAddress11, amount: 100, memo: "paypal test", submitter: testAddress10, nonce: 0, hash: "", signature: "", ucac: ucacAddrGBP, settlementCurrency: 'PAYPAL', settlementAmount: undefined, settlementBlocknumber: undefined }

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        paypalCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey10)
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
        const rejectRequest = { hash: paypalCredit.hash, signature: testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey11) }
        request(server).post('/reject').send(rejectRequest).expect(204, done)
      })

      it('GET /pending should return 0 records for user 2', function(done) {
        request(server).get('/pending/' + testAddress11).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function(done) {
        paypalCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey10)
        request(server).post('/lend').send(paypalCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function(done) {
        paypalCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey11)
        paypalCredit.submitter = testAddress11
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
        request(server).get('/balance/' + testAddress10 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 1 and user 2', function(done) {
        request(server).get('/balance/' + testAddress10 + '/' + testAddress11 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 2', function(done) {
        request(server).get('/balance/' + testAddress11 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 2 and user 1', function(done) {
        request(server).get('/balance/' + testAddress11 + '/' + testAddress10 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })
    })
  })

  // describe('Authentication', function(done) {
  //   //     [ testCase "nick signing" nickSignTest
  //   assertEqual "expected nick request signature" nickSignature (Right "6c965e1e501c18eedaf8af07dcdee651e0569efd017211be7faf10454c11bcf9611c8e9feaca7ac8ac400cce441db84ecbeb6f817fd8f40e321b33c3a0f4b21d1b")
  //   where
  //       unsignedNickRequest = NickRequest testAddress1 "testNick" ""
  //       nickSignature = generateSignature unsignedNickRequest testPrivkey1
  // })

//   describe('Utils', function(done) {
    //     [ testCase "parseIssueCreditInput" parseCreditInputTest
    // parseCreditInputTest :: Assertion
// parseCreditInputTest = do
//         assertEqual "expected credit log" creditLog (IssueCreditLog "869a8f2c3d22be392618ed06c8f548d1d5b5aed6" "754952bfa2097104a07f4f347e513a1da576ac7a" "3a1ea286e419130d894c9fa0cf49898bc81f9a5a" 2617 0 "fedex            ")
//         assertBool "good creditor sig" goodCreditorSig
//         assertBool "good debtor sig" goodDebtorSig
//     where (creditLog, _, goodCreditorSig, _, goodDebtorSig) = parseIssueCreditInput (Nonce 0) "0x0a5b410e000000000000000000000000869a8f2c3d22be392618ed06c8f548d1d5b5aed6000000000000000000000000754952bfa2097104a07f4f347e513a1da576ac7a0000000000000000000000003a1ea286e419130d894c9fa0cf49898bc81f9a5a0000000000000000000000000000000000000000000000000000000000000a394988c5614ea5a5807387af10ab3520ed0bb9e8edfcef07924b3630b119dccab12981d3efa478582c5c69a4c9ef5ccb3e019e52cd2b210cc0bc17133799d1f739000000000000000000000000000000000000000000000000000000000000001cd58818da99967a502e7abc5cc74b3569063c7670924d22e25c329b560298cc5566e07b7c87b7a8685f954410480fe2f5cd08dbcb84552dcc3b4475e8469f1b12000000000000000000000000000000000000000000000000000000000000001c6665646578202020202020202020202020202020202020202020202020202020"
    
//   })

  describe('Multi Transaction', function() {
    //     [ testCase "multiSettlementLendTest" multiSettlementLendTest
    const testCredit1 = { creditor: testAddress7, debtor: testAddress8, amount: 100, memo: "multi credit 1", submitter: testAddress7, nonce: 0, hash: "", signature: "", ucac: ucacAddrGBP, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }
    const testCredit2 = { creditor: testAddress7, debtor: testAddress8, amount: 50, memo: "multi credit 2", submitter: testAddress7, nonce: 1, hash: "", signature: "", ucac: ucacAddrGBP, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }

    const buffer1 = Buffer.concat([
      testUtil.hexToBuffer(testCredit1.ucac),
      testUtil.hexToBuffer(testCredit1.creditor),
      testUtil.hexToBuffer(testCredit1.debtor),
      testUtil.int32ToBuffer(testCredit1.amount),
      testUtil.int32ToBuffer(testCredit1.nonce),
    ])
    testCredit1.hash = testUtil.bufferToHex(ethUtil.sha3(buffer1))

    testCredit1.signature = testUtil.mobileSign(testCredit1, testPrivkey7)
    testCredit2.signature = testUtil.mobileSign(testCredit2, testPrivkey7)

    const buffer2 = Buffer.concat([
      testUtil.hexToBuffer(testCredit2.ucac),
      testUtil.hexToBuffer(testCredit2.creditor),
      testUtil.hexToBuffer(testCredit2.debtor),
      testUtil.int32ToBuffer(testCredit2.amount),
      testUtil.int32ToBuffer(testCredit2.nonce),
    ])
    testCredit2.hash = testUtil.bufferToHex(ethUtil.sha3(buffer2))

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1', function(done) {
      request(server).post('/multi_settlement').send([testCredit1, testCredit2]).expect(204, done)
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
      const rejectRequest = { hash: testCredit1.hash, signature: testUtil.mobileSign(testCredit1, testPrivkey8) }
      request(server).post('/reject').send(rejectRequest).expect(204, done)
    })

    it('POST /reject user 2 should reject credit2 from user 1', function(done) {
      const rejectRequest = { hash: testCredit2.hash, signature: testUtil.mobileSign(testCredit2, testPrivkey8) }
      request(server).post('/reject').send(rejectRequest).expect(204, done)
    })

    it('GET /pending should return 0 records for user 2', function(done) {
      request(server).get('/pending/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1 (2nd time)', function(done) {
      request(server).post('/multi_settlement').send([testCredit1, testCredit2]).expect(204, done)
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 2', function(done) {
      testCredit1.submitter = testAddress8
      testCredit2.submitter = testAddress8
      testCredit1.signature = testUtil.mobileSign(testCredit1, testPrivkey8)
      testCredit2.signature = testUtil.mobileSign(testCredit2, testPrivkey8)
      request(server).post('/multi_settlement').send([testCredit1, testCredit2]).expect(204, done)
    })

    xit('GET /pending should return 0 records for user 1', function(done) {
      request(server).get('/pending/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    xit('GET /transactions should return 2 records for user 1', function(done) {
      request(server).get('/transactions/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    xit('GET /balance should return the correct amount for user 1', function(done) {
      request(server).get('/balance/' + testAddress7 + '?currency=GBP').expect(200).then((res) => {
        assert.equal(res.body, 150)
        done()
      })
    })

    xit('GET /balance should return the correct balance between user 1 and user 2', function(done) {
      request(server).get('/balance/' + testAddress7 + '/' + testAddress8 + '?currency=GBP').expect(200).then((res) => {
        assert.equal(res.body, 150)
        done()
      })
    })

    xit('GET /balance should return the correct amount for user 2', function(done) {
      request(server).get('/balance/' + testAddress8 + '?currency=GBP').expect(200).then((res) => {
        assert.equal(res.body, -150)
        done()
      })
    })

    xit('GET /balance should return the correct balance between user 2 and user 1', function(done) {
      request(server).get('/balance/' + testAddress8 + '/' + testAddress7 + '?currency=GBP').expect(200).then((res) => {
        assert.equal(res.body, -150)
        done()
      })
    })

    xit('GET /counterparties for user 1 should include user 2', function(done) {
      request(server).get('/counterparties/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body[0], testAddress8)
        done()
      })
    })

    xit('GET /counterparties for user 2 should include user 1', function(done) {
      request(server).get('/counterparties/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body[0], testAddress7)
        done()
      })
    })

    xit('GET /friends should return a list containing user 2 for user 1', function(done) {
      request(server).get('/friends/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress8)
        done()
      })
    })

    xit('GET /friends should return a list containing user 1 for user 2', function(done) {
      request(server).get('/friends/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress7)
        done()
      })
    })
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

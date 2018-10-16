const assert = require('assert')
const request = require('supertest')
const server = require('../build/server.js')
const bufferUtil = require('../build/utils/buffer.util')
const testUtil = require('./util/test.util')

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
//         Just ucacAddrRUB = M.lookup "RUB" ucacAddresses
//         Just ucacAddrSEK = M.lookup "SEK" ucacAddresses
//         Just ucacAddrSGD = M.lookup "SGD" ucacAddresses
//         Just ucacAddrTHB = M.lookup "THB" ucacAddresses
//         Just ucacAddrTRY = M.lookup "TRY" ucacAddresses
//         Just ucacAddr = M.lookup "USD" ucacAddresses
//         Just ucacAddrVND = M.lookup "VND" ucacAddresses
//     return (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND)


describe('LNDR Server', function() {
  describe('Nicknames and Friends', function() {
    it('GET /user?nick= should respond with 404 if nick is not taken', function(done) {
      request(server).get('/user?nick=' + testNick1).expect(404, done)
    })

    it('POST /nick should store the nickname', function() {
      const nickRequest = {
        nickRequestAddr: testAddress3,
        nickRequestNick: testNick1,
        nickRequestSignature: testUtil.sign([bufferUtil.hexToBuffer(testAddress3)], testPrivkey3)
      }

      request(server).post('/nick' + testNick1).send(nickRequest).expect(204, done)
    })

    it('GET /user?nick= should respond with 200 if nick is taken', function() {
      request(server).get('/user?nick=' + testNick1).expect(200, done)
    })

    it('GET /nick should respond with the correct nickname for the given address', function() {
      request(server).get('/nick/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body, testNick1)
        done()
      })
    })

    it('POST /nick should fail if nick is already taken', function() {
      const nickRequest = {
        nickRequestAddr: testAddress4,
        nickRequestNick: testNick1,
        nickRequestSignature: testUtil.sign([bufferUtil.hexToBuffer(testAddress4)], testPrivkey4)
      }

      request(server).post('/nick').send(nickRequest).expect(400, done)
    })

    it('POST /nick should succeed when changing nick', function() {
      const nickRequest = {
        nickRequestAddr: testAddress4,
        nickRequestNick: testNick1,
        nickRequestSignature: testUtil.sign([bufferUtil.hexToBuffer(testAddress4)], testPrivkey4)
      }

      request(server).post('/nick').send(nickRequest).expect(204, done)
    })

    it('GET /nick should confirm that nick was changed', function() {
      request(server).get('/nick/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body, testNick2)
        done()
      })
    })

    it('POST /nick should allow new user to use discarded nick', function() {
      const nickRequest = {
        nickRequestAddr: testAddress4,
        nickRequestNick: testNick1,
        nickRequestSignature: testUtil.sign([bufferUtil.hexToBuffer(testAddress4)], testPrivkey4)
      }

      request(server).post('/nick').send(nickRequest).expect(204, done)
    })

    it('GET /nick should return fuzzy search results for both nicks', function() {
      request(server).get('/search_nick/' + testSearch).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    it('POST /add_friends should allow a user to send a friend request', function() {
      request(server).post('/add_friends/' + testAddress3).send([testAddress4]).expect(204, done)
    })

    it('GET /friends should return an empty list for user 1', function() {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friends should return an empty list for user 2', function() {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friend_requests should return a pending from user 1', function() {
      request(server).get('/friend_requests/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress3)
        done()
      })
    })

    it('GET /friend_requests should not return a pending from user 2', function() {
      request(server).get('/friend_requests/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /outbound_friend_requests should not return a pending from user 2', function() {
      request(server).get('/outbound_friend_requests/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /outbound_friend_requests should return a pending outbound from user 1', function() {
      request(server).get('/outbound_friend_requests/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress3)
        done()
      })
    })

    it('POST /add_friends should create a friendship once both parties have confirmed', function() {
      request(server).post('/add_friends/' + testAddress4).send([testAddress3]).expect(204, done)
    })

    it('GET /friends should return a list containing user 2 for user 1', function() {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress4)
        done()
      })
    })

    it('GET /friends should return a list containing user 1 for user 2', function() {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress3)
        done()
      })
    })

    it('POST /remove_friends should remove two users as friends if user 1 removes user 2', function() {
       request(server).post('/remove_friends/' + testAddress3).send([testAddress4]).expect(204, done)
    })

    it('GET /friends should return an empty list for user 1', function() {
      request(server).get('/friends/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friends should return an empty list for user 2', function() {
      request(server).get('/friends/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friend_requests should not return a pending from user 2', function() {
      request(server).get('/friend_requests/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /friend_requests should not return a pending from user 1', function() {
      request(server).get('/friend_requests/' + testAddress4).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /user?email= should respond with 404 if email is not taken', function(done) {
      request(server).get('/user?email=' + testEmail).expect(404, done)
    })

    it('POST /email should set the email for a given user', function() {
      // set email for user1
      const emailRequest = {
        emailRequestAddr: testAddress3,
        emailRequestEmail: testEmail,
        emailRequestSignature: testUtil.sign([bufferUtil.hexToBuffer(testAddress3)], testPrivkey3)
      }
      
      request(server).post('/email').send(emailRequest).expect(204, done)
    })

    it('GET /user?email= should respond with 200 now that email is taken', function(done) {
      request(server).get('/user?email=' + testEmail).expect(200, done)
    })

    it('should', function() {
      // check that email for user3 properly set
      request(server).get('/email/' + testAddress3).expect(200).then((res) => {
        assert.equal(res.body, testEmail)
        done()
      })
    })
  })

  describe('Credits', function() {
    describe('Basic Credit Test', function() {
      // (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND) <- loadUcacs

      const usdCredit = new CreditRecord({ creditor: testAddress1, debtor: testAddress2, amount: 100, memo: "USD test 1", submitter: testAddress1, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined })
      const badCredit = new CreditRecord({ creditor: testAddress1, debtor: testAddress1, amount: 100, memo: "bad test", submitter: testAddress1, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined })

      // testCase "lend money to friend" basicLendTest
      // user1 fails to submit pending credit to himself
      it('POST /lend should fail if creditor and debtor are the same', function() {
        usdCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(usdCredit.hash)], testPrivkey1)
        request(server).post('/lend').send(badCredit).expect(400, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function() {
        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('GET /pending should return 1 record for user 1', function() {
        request(server).get('/pending/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /pending should return 1 record for user 2', function() {
        request(server).get('/pending/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('POST /reject user 2 should reject credit from user 1', function() {
        const rejectRequest = { hash: usdCredit.hash, signature: testUtil.sign([bufferUtil.hexToBuffer(usdCredit.hash)], testPrivkey2) }
        request(server).post('/reject').send(rejectRequest).expect(204, done)
      })

      it('GET /pending should return 0 records for user 2', function() {
        request(server).get('/pending/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function() {
        usdCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(usdCredit.hash)], testPrivkey1)
        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function() {
        usdCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(usdCredit.hash)], testPrivkey2)
        usdCredit.submitter = testAddress2
        request(server).post('/lend').send(usdCredit).expect(204, done)
      })

      it('GET /pending should return 0 records for user 1', function() {
        request(server).get('/pending/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('GET /transactions should return 1 record for user 1', function() {
        request(server).get('/transactions?user=' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 1', function() {
        request(server).get('/balance/' + testAddress1 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 1 and user 2', function() {
        request(server).get('/balance/' + testAddress1 + '/' + testAddress2 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 2', function() {
        request(server).get('/balance/' + testAddress2 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 2 and user 1', function() {
        request(server).get('/balance/' + testAddress2 + '/' + testAddress1 + '?currency=USD').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /counterparties for user 1 should include user 2', function() {
        request(server).get('/counterparties/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body[0], testAddress2)
          done()
        })
      })

      it('GET /counterparties for user 2 should include user 1', function() {
        request(server).get('/counterparties/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body[0], testAddress1)
          done()
        })
      })

      it('GET /friends should return a list containing user 2 for user 1', function() {
        request(server).get('/friends/' + testAddress1).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          assert.equal(res.body[0].address, testAddress2)
          done()
        })
      })
  
      it('GET /friends should return a list containing user 1 for user 2', function() {
        request(server).get('/friends/' + testAddress2).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          assert.equal(res.body[0].address, testAddress1)
          done()
        })
      })

      const jpyCredit = new CreditRecord({ creditor: testAddress1, debtor: testAddress2, amount: 20000, memo: "USD test 1", submitter: testAddress2, nonce: 0, hash: "", signature: "", ucac: ucacAddrJPY, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined })

      it('POST /lend should return 204 for a successful credit submission from user 2', function() {
        jpyCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(jpyCredit.hash)], testPrivkey2)
        request(server).post('/lend').send(jpyCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function() {
        jpyCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(jpyCredit.hash)], testPrivkey1)
        jpyCredit.submitter = testAddress1
        request(server).post('/lend').send(jpyCredit).expect(204, done)
      })

      it('GET /balance should return the correct JPY amount for user 2', function() {
        request(server).get('/balance/' + testAddress2 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, -20000)
          done()
        })
      })

      it('GET /balance should return the correct JPY balance between user 2 and user 1', function() {
        request(server).get('/balance/' + testAddress2 + '/' + testAddress1 + '?currency=JPY').expect(200).then((res) => {
          assert.equal(res.body, -20000)
          done()
        })
      })
    })

    describe('Basic Settlement Test', function() {
      (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND) <- loadUcacs

      const settlementCredit = new CreditRecord({ creditor: testAddress5, debtor: testAddress6, amount: 2939, memo: 'test settlement', submitter: testAddress5, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined })

      let settleAmount = 0
      // user5 submits pending settlement credit to user6
      it('POST /lend should be successful', function() {
        settlementCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit.hash)], testPrivkey5)
        request(server).post('/lend').send(settlementCredit).expect(204, done)
      })

      it('GET /pending_settlements should have 1 pending settlement for user 5', function() {
        request(server).get('/pending_settlements/' + testAddress5).expect(200).then((res) => {
          assert.equal(res.body.pendingSettlements.length, 1)
          assert.equal(res.body.bilateralPendingSettlements.length, 0)
          done()
        })
      })

      it('POST /lend should be successful', function() {
        settlementCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit.hash)], testPrivkey6)
        request(server).post('/lend').send(settlementCredit).expect(204, done)
      })

      it('GET /pending_settlements should have 1 pending settlement for user 5', function() {
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

    describe('DAI Settlement Test', function() {
      //copy from above
    })

    describe('PayPal Settlement Test', function() {
      const paypalCredit = new CreditRecord({ creditor: testAddress10, debtor: testAddress11, amount: 100, memo: "paypal test", submitter: testAddress10, nonce: 0, hash: "", signature: "", ucac: ucacAddrGBP, settlementCurrency: 'PAYPAL', settlementAmount: undefined, settlementBlocknumber: undefined })

      it('POST /lend should return 204 for a successful credit submission from user 1', function() {
        paypalCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey10)
        request(server).post('/lend').send(paypalCredit).expect(204, done)
      })

      it('GET /pending should return 1 record for user 1', function() {
        request(server).get('/pending/' + testAddress10).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /pending should return 1 record for user 2', function() {
        request(server).get('/pending/' + testAddress11).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('POST /reject user 2 should reject credit from user 1', function() {
        const rejectRequest = { hash: paypalCredit.hash, signature: testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey11) }
        request(server).post('/reject').send(rejectRequest).expect(204, done)
      })

      it('GET /pending should return 0 records for user 2', function() {
        request(server).get('/pending/' + testAddress11).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('POST /lend should return 204 for a successful credit submission from user 1', function() {
        paypalCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey10)
        request(server).post('/lend').send(paypalCredit).expect(204, done)
      })

      it('POST /lend should return 204 for a successful credit submission from user 2', function() {
        paypalCredit.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalCredit.hash)], testPrivkey11)
        paypalCredit.submitter = testAddress11
        request(server).post('/borrow').send(paypalCredit).expect(204, done)
      })

      it('GET /pending should return 0 records for user 1', function() {
        request(server).get('/pending/' + testAddress10).expect(200).then((res) => {
          assert.equal(res.body.length, 0)
          done()
        })
      })

      it('GET /transactions should return 1 record for user 1', function() {
        request(server).get('/transactions?user=' + testAddress10).expect(200).then((res) => {
          assert.equal(res.body.length, 1)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 1', function() {
        request(server).get('/balance/' + testAddress10 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 1 and user 2', function() {
        request(server).get('/balance/' + testAddress10 + '/' + testAddress11 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, 100)
          done()
        })
      })

      it('GET /balance should return the correct amount for user 2', function() {
        request(server).get('/balance/' + testAddress11 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
      })

      it('GET /balance should return the correct balance between user 2 and user 1', function() {
        request(server).get('/balance/' + testAddress11 + '/' + testAddress10 + '?currency=GBP').expect(200).then((res) => {
          assert.equal(res.body, -100)
          done()
        })
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

      it('POST /register_push should correctly register the push ID', function() {
        testPush.signature = testUtil.sign([bufferUtil.hexToBuffer(testPush.address)], testPrivkey1)
        request(server).post('/register_push').send(testPush).expect(204, done)
      })

      it('POST /register_push should register twice with the same address and device', function() {
        testPush.signature = testUtil.sign([bufferUtil.hexToBuffer(testPush.address)], testPrivkey1)
        request(server).post('/register_push').send(testPush).expect(204, done)
      })

      it('POST /register_push should register twice with the same address and device', function() {
        testPush.address = testAddress2
        testPush.signature = testUtil.sign([bufferUtil.hexToBuffer(testPush.address)], testPrivkey2)
        request(server).post('/register_push').send(testPush).expect(204, done)
      })

      it('POST /register_push should correctly register with a new address and device', function() {
        testPush.address = testAddress2
        testPush.channelID = "79312004-103e-4ba8-b4bf-65eb3eb59818"
        testPush.platform = 'android'
        testPush.signature = testUtil.sign([bufferUtil.hexToBuffer(testPush.address)], testPrivkey2)
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

      it('POST /unregister_push should delete the db entry for that channelID', function() {
        testPush.signature = testUtil.sign([bufferUtil.hexToBuffer(testPush.address)], testPrivkey1)
        request(server).post('/unregister_push').send(testPush).expect(204, done)
      })
    })
  })

  // describe('Authentication', function() {
  //   //     [ testCase "nick signing" nickSignTest
  //   assertEqual "expected nick request signature" nickSignature (Right "6c965e1e501c18eedaf8af07dcdee651e0569efd017211be7faf10454c11bcf9611c8e9feaca7ac8ac400cce441db84ecbeb6f817fd8f40e321b33c3a0f4b21d1b")
  //   where
  //       unsignedNickRequest = NickRequest testAddress1 "testNick" ""
  //       nickSignature = generateSignature unsignedNickRequest testPrivkey1
  // })

//   describe('Utils', function() {
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
    (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND) <- loadUcacs

    const testCredit1 = new CreditRecord({ creditor: testAddress7, debtor: testAddress8, amount: 100, memo: "multi credit 1", submitter: testAddress7, nonce: 0, hash: "", signature: "", ucac: ucacAddrGBP, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined })
    const testCredit2 = new CreditRecord({ creditor: testAddress7, debtor: testAddress8, amount: 50, memo: "multi credit 2", submitter: testAddress7, nonce: 0, hash: "", signature: "", ucac: ucacAddrGBP, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1', function() {
      testCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(testCredit1.hash)], testPrivkey7)
      testCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(testCredit2.hash)], testPrivkey7)
      request(server).post('/multi_settlement').send([testCredit1, testCredit2]).expect(204, done)
    })

    it('GET /pending should return 1 record for user 1', function() {
      request(server).get('/pending/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        done()
      })
    })

    it('GET /pending should return 1 record for user 2', function() {
      request(server).get('/pending/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        done()
      })
    })

    it('POST /reject user 2 should reject credit1 from user 1', function() {
      const rejectRequest = { hash: testCredit1.hash, signature: testUtil.sign([bufferUtil.hexToBuffer(testCredit1.hash)], testPrivkey2) }
      request(server).post('/reject').send(rejectRequest).expect(204, done)
    })

    it('POST /reject user 2 should reject credit2 from user 1', function() {
      const rejectRequest = { hash: testCredit2.hash, signature: testUtil.sign([bufferUtil.hexToBuffer(testCredit2.hash)], testPrivkey2) }
      request(server).post('/reject').send(rejectRequest).expect(204, done)
    })

    it('GET /pending should return 0 records for user 2', function() {
      request(server).get('/pending/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1 (2nd time)', function() {
      testCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(testCredit1.hash)], testPrivkey7)
      testCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(testCredit2.hash)], testPrivkey7)
      request(server).post('/multi_settlement').send([testCredit1, testCredit2]).expect(204, done)
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 2', function() {
      testCredit1.submitter = testAddress8
      testCredit2.submitter = testAddress8
      testCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(testCredit1.hash)], testPrivkey8)
      testCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(testCredit2.hash)], testPrivkey8)
      request(server).post('/multi_settlement').send([testCredit1, testCredit2]).expect(204, done)
    })

    it('GET /pending should return 0 records for user 1', function() {
      request(server).get('/pending/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /transactions should return 2 records for user 1', function() {
      request(server).get('/transactions?user=' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 2)
        done()
      })
    })

    it('GET /balance should return the correct amount for user 1', function() {
      request(server).get('/balance/' + testAddress7 + '?currency=USD').expect(200).then((res) => {
        assert.equal(res.body, 150)
        done()
      })
    })

    it('GET /balance should return the correct balance between user 1 and user 2', function() {
      request(server).get('/balance/' + testAddress7 + '/' + testAddress8 + '?currency=USD').expect(200).then((res) => {
        assert.equal(res.body, 150)
        done()
      })
    })

    it('GET /balance should return the correct amount for user 2', function() {
      request(server).get('/balance/' + testAddress8 + '?currency=USD').expect(200).then((res) => {
        assert.equal(res.body, -150)
        done()
      })
    })

    it('GET /balance should return the correct balance between user 2 and user 1', function() {
      request(server).get('/balance/' + testAddress8 + '/' + testAddress7 + '?currency=USD').expect(200).then((res) => {
        assert.equal(res.body, -150)
        done()
      })
    })

    it('GET /counterparties for user 1 should include user 2', function() {
      request(server).get('/counterparties/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body[0], testAddress8)
        done()
      })
    })

    it('GET /counterparties for user 2 should include user 1', function() {
      request(server).get('/counterparties/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body[0], testAddress7)
        done()
      })
    })

    it('GET /friends should return a list containing user 2 for user 1', function() {
      request(server).get('/friends/' + testAddress7).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress8)
        done()
      })
    })

    it('GET /friends should return a list containing user 1 for user 2', function() {
      request(server).get('/friends/' + testAddress8).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        assert.equal(res.body[0].address, testAddress7)
        done()
      })
    })
  })

  describe('Multi Settlement', function() {
    
    (ucacAddrAUD, ucacAddrCAD, ucacAddrCHF, ucacAddrCNY, ucacAddrDKK, ucacAddrEUR, ucacAddrGBP, ucacAddrHKD, ucacAddrIDR, ucacAddrILS, ucacAddrINR, ucacAddrJPY, ucacAddrKRW, ucacAddrMYR, ucacAddrNOK, ucacAddrNZD, ucacAddrRUB, ucacAddrSEK, ucacAddrSGD, ucacAddrTHB, ucacAddrTRY, ucacAddr, ucacAddrVND) <- loadUcacs

    const settlementCredit1 = new CreditRecord({ creditor: testAddress9, debtor: testAddress0, amount: 2939, memo: 'advanced settlement 1', submitter: testAddress9, nonce: 0, hash: "", signature: "", ucac:ucacAddrJPY, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined })
    const settlementCredit1 = new CreditRecord({ creditor: testAddress0, debtor: testAddress9, amount: 1939, memo: 'advanced settlement 2', submitter: testAddress9, nonce: 1, hash: "", signature: "", ucac:ucacAddrJPY, settlementCurrency: 'ETH', settlementAmount: undefined, settlementBlocknumber: undefined })

    let settleAmount1 = 0, settleAmount2 = 0
    
    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 1', function() {
      settlementCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit1.hash)], testPrivkey9)
      settlementCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit2.hash)], testPrivkey9)
      request(server).post('/multi_settlement').send([settlementCredit1, settlementCredit2]).expect(204, done)
    })

    it('GET /pending_settlements should have 1 pending settlement for user 5', function() {
      request(server).get('/pending_settlements/' + testAddress9).expect(200).then((res) => {
        assert.equal(res.body.pendingSettlements.length, 2)
        assert.equal(res.body.bilateralPendingSettlements.length, 0)
        done()
      })
    })

    it('POST /multi_settlement should return 204 for a successful multi credit submission from user 2', function() {
      settlementCredit1.submitter = testAddress0
      settlementCredit2.submitter = testAddress0
      settlementCredit1.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit1.hash)], testPrivkey0)
      settlementCredit2.signature = testUtil.sign([bufferUtil.hexToBuffer(settlementCredit2.hash)], testPrivkey0)
      request(server).post('/multi_settlement').send([settlementCredit1, settlementCredit2]).expect(204, done)
    })

    it('GET /pending_settlements should have 2 bilateral pending settlements for user 9', function() {
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

  describe('PayPal Requests Test', function() {
    const paypalRequest = {
      friend: testAddress2,
      requestor: testAddress1,
      signature: ''
    }

    it('POST /request_paypal should create a paypal request', function() {
      paypalRequest.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalRequest.requestor)], testPrivkey1)
      request(server).post('/request_paypal').send(paypalRequest).expect(204, done)
    })

    it('GET /request_paypal returns a list of requests', function() {
      request(server).get('/request_paypal/' + testAddress0).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        done()
      })
    })

    it('GET /request_paypal returns a list of requests', function() {
      request(server).get('/request_paypal/' + testAddress1).expect(200).then((res) => {
        assert.equal(res.body.length, 1)
        done()
      })
    })

    it('POST /request_paypal should create a paypal request', function() {
      paypalRequest.signature = testUtil.sign([bufferUtil.hexToBuffer(paypalRequest.requestor)], testPrivkey1)
      request(server).post('/remove_paypal_request').send(paypalRequest).expect(204, done)
    })

    it('GET /request_paypal returns a list of requests', function() {
      request(server).get('/request_paypal/' + testAddress0).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })

    it('GET /request_paypal returns a list of requests', function() {
      request(server).get('/request_paypal/' + testAddress1).expect(200).then((res) => {
        assert.equal(res.body.length, 0)
        done()
      })
    })
  })
})

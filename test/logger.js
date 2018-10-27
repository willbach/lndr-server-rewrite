var Web3 = require('web3')
var Tx = require('ethereumjs-tx')
var fs = require('fs')
var path = require('path')
var ethUtil = require('ethereumjs-util')
var testUtil = require('./util/test.util')

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var rawAbi = fs.readFileSync(path.join(__dirname, '../data/CreditProtocol.abi.json'), {encoding: 'utf8'})
var cpAbi = JSON.parse(rawAbi)
var creditProtocolAddress = '0x1aa76056924bf4768d63357eca6d6a56ec929131'

var cpContract = web3.eth.contract(cpAbi).at(creditProtocolAddress)

// cpContract.events.IssueCreditError({
//     fromBlock: 0
// }, function(error, event){ console.log(error, event) })
// .on('data', function(event){
//     console.log(event); // same results as the optional callback above
// })
// .on('error', console.error)

var issueCreditErrorSubscription = cpContract.allEvents({}, function(err, logs) {
    console.log(err, logs)
})






var recordToCP = async() => {
    var executionPrivateKey = 'edc63d0e14b29aaa26c7585e962f93abb59bd7d8b01b585e073dc03d052a000b'
    var executionAddress = testUtil.privateToAddress(executionPrivateKey)
    var testPrivkey1  = "bb63b692f9d8f21f0b978b596dc2b8611899f053d68aec6c1c20d1df4f5b6ee2"
    var testPrivkey2  = "2f615ea53711e0d91390e97cdd5ce97357e345e441aa95d255094164f44c8652"
    var testAddress1  = testUtil.privateToAddress(testPrivkey1)
    var testAddress2  = testUtil.privateToAddress(testPrivkey2)
    var ucacAddr = '6804f48233f6ff2b468f7636560d525ca951931e'

    var usdCredit = { creditor: testAddress1, debtor: testAddress2, amount: 10, memo: "USD test 1", submitter: testAddress1, nonce: 0, hash: "", signature: "", ucac: ucacAddr, settlementCurrency: undefined, settlementAmount: undefined, settlementBlocknumber: undefined }

    var usdBuffer = Buffer.concat([
        testUtil.hexToBuffer(usdCredit.ucac),
        testUtil.hexToBuffer(usdCredit.creditor),
        testUtil.hexToBuffer(usdCredit.debtor),
        testUtil.int32ToBuffer(usdCredit.amount),
        testUtil.int32ToBuffer(usdCredit.nonce)
    ])
    var hash = testUtil.bufferToHex(ethUtil.sha3(usdBuffer))
    var privateKeyBuffer = Buffer.from(executionPrivateKey, 'hex')


    // var credV = web3.toDecimal("0x" + creditorSignature.substr(128, 2))
    // if (credV < 27) credV += 27
    // var debtV = web3.toDecimal("0x" + debtorSignature.substr(128, 2))
    // if (debtV < 27) debtV += 27

    // var cSig = [
    //     '0x' + creditorSignature.substr(0, 64),
    //     '0x' + creditorSignature.substr(64, 64),
    //     bignumToHexString(web3.toBigNumber(credV)),
    // ]
    // var dSig = [
    //     '0x' + debtorSignature.substr(0, 64),
    //     '0x' + debtorSignature.substr(64, 64),
    //     bignumToHexString(web3.toBigNumber(debtV)),
    // ]

    var content = creditHash(`0x${usdCredit.ucac}`, `0x${usdCredit.creditor}`, `0x${usdCredit.debtor}`, bignumToHexString(usdCredit.amount), bignumToHexString(usdCredit.nonce))
    
    // var cSig = sign(testAddress1, content)
    // var dSig = sign(testAddress2, content)

    var cSig2 = mobileSign(usdCredit, testPrivkey1)
    var dSig2 = mobileSign(usdCredit, testPrivkey2)

    cSig = generateBytes32Signature(cSig2)
    dSig = generateBytes32Signature(dSig2)

    var nonce = await new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(`0x${executionAddress}`, (e, data) => e ? reject(e) : resolve(data))
    })

    var bytes32Memo = web3.fromAscii(usdCredit.memo)
    var fullAmount = bignumToHexString(usdCredit.amount)
    var callData = cpContract.issueCredit.getData(`0x${usdCredit.ucac}`, `0x${usdCredit.creditor}`, `0x${usdCredit.debtor}`, fullAmount, [cSig.r, cSig.s, cSig.v], [dSig.r, dSig.s, dSig.v], bytes32Memo)

    console.log('CALL DATA', callData)
    console.log(`0x${usdCredit.ucac}`, `0x${usdCredit.creditor}`, `0x${usdCredit.debtor}`, fullAmount, cSig, dSig, bytes32Memo)
    console.log('UCAC, CREDITOR, and DEBTOR ADDRESSES ARE 42 CHARS:', `0x${usdCredit.ucac}`.length === 42, `0x${usdCredit.creditor}`.length === 42, `0x${usdCredit.debtor}`.length === 42)
    // console.log('CREDITOR ADDRESS MATCHES SIGNATURE:', ethUtil.pubToAddress( ethUtil.ecrecover(Buffer.from(hash, 'hex'), cSig[2], cSig[0], cSig[1]) ).toString('hex') === testAddress1)
    // console.log('DEBTOR ADDRESS MATCHES SIGNATURE:', ethUtil.pubToAddress( ethUtil.ecrecover(Buffer.from(hash, 'hex'), dSig[2], dSig[0], dSig[1]) ).toString('hex') === testAddress2)
    console.log('FULL AMOUNT IS 66 CHARACTERS:', fullAmount.length === 66)

    var rawTx = {
        nonce: nonce,
        gasPrice: 200000000,
        gasLimit: 250000,
        to: creditProtocolAddress,
        from: `0x${executionAddress}`,
        data: callData,
        value: '0x00',
        chainId: 1
    }
    console.log(rawTx)

    var tx = new Tx(rawTx)
    tx.sign(privateKeyBuffer)
    var serializedTx = tx.serialize()
    
    return new Promise((resolve, reject) => {
        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })



    function fillBytes32(ascii) {
        // 66 instead of 64 to account for the '0x' prefix
        return '0x' + '0'.repeat(66 - ascii.length) + ascii.slice(2);
    }

    function sign(signer, content, privateKeyBuffer) {
        var contentHash = web3.sha3(content, {encoding: 'hex'});
        var sig = web3.eth.sign(signer, contentHash, {encoding: 'hex'});
        sig = sig.substr(2, sig.length);
    
        var res = {};
        res.r = "0x" + sig.substr(0, 64);
        res.s = "0x" + sig.substr(64, 64);
        res.v = web3.toDecimal("0x" + sig.substr(128, 2));
        if (res.v < 27) res.v += 27;
        res.v = bignumToHexString(web3.toBigNumber(res.v));
    
        return res
    }

    function mobileSign(usdCredit, privateKey) {
        var { ucac, creditor, debtor, amount, nonce } = usdCredit

        var buffer = Buffer.concat([
            testUtil.hexToBuffer(ucac),
            testUtil.hexToBuffer(creditor),
            testUtil.hexToBuffer(debtor),
            testUtil.int32ToBuffer(amount),
            testUtil.int32ToBuffer(nonce)
        ])
        
        var insideHash = ethUtil.sha3(buffer)

        var privateKeyBuffer = Buffer.from(privateKey, 'hex')
    
        var { r, s, v } = ethUtil.ecsign(
            ethUtil.hashPersonalMessage(insideHash),
            privateKeyBuffer
        )
      
        return testUtil.bufferToHex(
            Buffer.concat(
                [ r, s, Buffer.from([ v ]) ]
            )
        )
    }

    function generateBytes32Signature(sig) {
        var res = {}
        res.r = "0x" + sig.substr(0, 64)
        res.s = "0x" + sig.substr(64, 64)
        res.v = web3.toDecimal("0x" + sig.substr(128, 2))
        if (res.v < 27) res.v += 27;
        res.v = bignumToHexString(web3.toBigNumber(res.v));
    
        return res
    }

    function bignumToHexString(num) {
        var a = num.toString(16);
        return "0x" + '0'.repeat(64 - a.length) + a;
    }

    function creditHash(ucacAddr, p1, p2, amount, nonce) {
        console.log(ucacAddr, p1, p2, amount, nonce)
        return [ucacAddr, p1, p2, amount, nonce].map(stripHex).join("")
    }

    function stripHex(addr) {
        return addr.substr(2, addr.length);
    }
}

recordToCP().then(console.log).catch(console.log)


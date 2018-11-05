"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethUtil = require('ethereumjs-util');
var Web3 = require('web3');
var web3 = new Web3();
var buffer_util_1 = require("./buffer.util");
exports.decomposeSignature = function (signature) {
    // Strip leading '0x', r is first 64 bytes, s is next 64 bytes, v is last 2 bytes
    var signatureBuffer = buffer_util_1.hexToBuffer(signature);
    var r = signatureBuffer.slice(0, 32);
    var s = signatureBuffer.slice(32, 64);
    var v = signatureBuffer.readUIntBE(64, 1);
    return { r: r, s: s, v: v };
};
exports.signatureToAddress = function (hexHash, signature, hashPersonalMessage) {
    if (hashPersonalMessage === void 0) { hashPersonalMessage = true; }
    var _a = exports.decomposeSignature(signature), v = _a.v, r = _a.r, s = _a.s;
    var hash = hashPersonalMessage ? ethUtil.hashPersonalMessage(Buffer.from(hexHash, 'hex')) : buffer_util_1.hexToBuffer(hexHash);
    var addressBuffer = ethUtil.pubToAddress(ethUtil.ecrecover(hash, v, r, s));
    return addressBuffer.toString('hex');
};
exports.determineSigner = function (transaction, signature) {
    var sigAddress = exports.signatureToAddress(transaction.hash, signature);
    if (transaction.creditor === sigAddress) {
        return 'creditor';
    }
    else if (transaction.debtor === sigAddress) {
        return 'debtor';
    }
    return null;
};
exports.verifySignature = function (transaction, signature) {
    var sigAddress = exports.signatureToAddress(transaction.hash, signature);
    return transaction.creditor === sigAddress || transaction.debtor === sigAddress;
};
exports.bignumToHexString = function (num) {
    var a = num.toString(16);
    return "0x" + '0'.repeat(64 - a.length) + a;
};
exports.decomposeSignatureToBytes32 = function (hexSignature) {
    var res = {};
    res.r = "0x" + hexSignature.substr(0, 64);
    res.s = "0x" + hexSignature.substr(64, 64);
    res.v = web3.toDecimal("0x" + hexSignature.substr(128, 2));
    if (res.v < 27) {
        res.v += 27;
    }
    res.v = exports.bignumToHexString(web3.toBigNumber(res.v));
    return res;
};
exports.privateToAddress = function (privateKeyHex) {
    var privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
    return ethUtil.privateToAddress(privateKeyBuffer).toString('hex');
};
//   TextToHostPreference :: Text -> W.HostPreference
// TextToHostPreference = fromString . T.unpack
// HashCreditLog :: IssueCreditLog -> Text
// HashCreditLog (IssueCreditLog ucac creditor debtor amount nonce _) =
//                 Let message = T.concat $
//                       StripHexPrefix <$> [ Addr.toText ucac
//                                          , Addr.toText creditor
//                                          , Addr.toText debtor
//                                          , integerToHex amount
//                                          , integerToHex nonce
//                                          ]
//                 In EU.hashText message
// DecomposeSig :: Text -> (BytesN 32, BytesN 32, BytesN 32)
// DecomposeSig sig = (sigR, sigS, sigV)
//     Where strippedSig = stripHexPrefix sig
//           SigR = BytesN . bytesDecode $ T.take 64 strippedSig
//           SigS = BytesN . bytesDecode . T.take 64 . T.drop 64 $ strippedSig
//           SigV = BytesN . bytesDecode . alignR . T.take 2 . T.drop 128 $ strippedSig
// BytesDecode :: Text -> BA.Bytes
// BytesDecode = BA.convert . fst . BS16.decode . T.encodeUtf8
// BytesEncode :: Text -> Text
// BytesEncode = T.decodeUtf8 . BS16.encode . T.encodeUtf8
// TextToBytesN32 :: Text -> BytesN 32
// TextToBytesN32 = BytesN . bytesDecode . T.take 64 . T.drop 2
// AddrToBS :: Address -> B.ByteString
// AddrToBS = T.encodeUtf8 . Addr.toText
// TakeNthByte32 :: Int -> Text -> Text
// TakeNthByte32 n = T.take byte32CharLength . T.drop (n * byte32CharLength) . stripHexPrefix
//     Where byte32CharLength = 64
// -- transforms the standard ('0x' + 64-char) bytes32 rendering of a log field into the
// -- 40-char hex representation of an address
// Bytes32ToAddress :: Text -> Either SomeException Address
// Bytes32ToAddress = mapLeft (toException . TypeError) . Addr.fromText . T.drop 26
// AddressToBytes32 :: Address -> Text
// AddressToBytes32 = T.append "0x" . alignR . Addr.toText
// TextToAddress :: Text -> Address
// TextToAddress = fromRight (error "bad address") . Addr.fromText
// HexToInteger :: Text -> Integer
// HexToInteger = fst . head . readHex . T.unpack . stripHexPrefix
// StripHexPrefix :: Text -> Text
// StripHexPrefix x | T.isPrefixOf "0x" x = T.drop 2 x
//                  | otherwise           = x
// AddHexPrefix :: Text -> Text
// AddHexPrefix x | T.isPrefixOf "0x" x = x
//                | otherwise           = T.append "0x" x
// IntegerToHex :: Integer -> Text
// IntegerToHex x = T.append "0x" strRep
//     Where strRep = alignR . T.pack $ showHex x ""
// IntegerToHex' :: Integer -> Text
// IntegerToHex' x = T.append "0x" . T.pack $ showHex x ""
// RoundToMegaWei :: Integer -> Integer
// RoundToMegaWei int = int - (int `mod` 10 ^ 6)
// Align :: Text -> (Text, Text)
// Align v = (v <> zeros, zeros <> v)
//   Where zerosLen = 64 - (T.length v `mod` 64)
//         Zeros = T.replicate zerosLen "0"
// AlignL :: Text -> Text
// AlignL = fst . align
// AlignR :: Text -> Text
// AlignR = snd . align
// GetUcac :: B.Bimap Text Address -> Maybe Text -> Address
// GetUcac ucacAddresses currency =
//     Let defaultUcac = fromMaybe (error "no USD ucac registered") $ B.lookup "USD" ucacAddresses
//     In fromMaybe defaultUcac $ (`B.lookup` ucacAddresses) =<< currency
// ConfigToResponse :: ServerConfig -> ConfigResponse
// ConfigToResponse config = ConfigResponse (B.toMap $ lndrUcacAddrs config)
//                                          (creditProtocolAddress config)
//                                          (gasPrice config) (ethereumPrices config)
//                                          (latestBlockNumber config - 40600)
// -- example input data: 0x0a5b410e000000000000000000000000869a8f2c3d22be392618ed06c8f548d1d5b5aed600000000000000000000000070d71994d0414c19c1f09f1f2946544e8d97c4290000000000000000000000001b5fec5060e51886184d30b3d211d50836087b83000000000000000000000000000000000000000000000000000000000000006481e2e0f119561515281f1c76d64431760a8612305931f5378f3004da3aa6209927b3f24c58888a06da343aa4bf1f3520122e703e6ccf146ee9ac60e2123b10d8000000000000000000000000000000000000000000000000000000000000001bb6ff2d00768200c769018c277d53b2e2a3a3d5f4d740a2acc3e35cb4421dd38a45a02960d1e92cf061a357a819072658a482c02c4a4ee06e01cb58cf66bc3a8f000000000000000000000000000000000000000000000000000000000000001c736f6d657468696e672020202020202020202020202020202020202020202020
// ParseIssueCreditInput :: Nonce -> Text -> (IssueCreditLog, Text, Bool, Text, Bool)
// ParseIssueCreditInput (Nonce nonce) inputData = ( creditLog
//                                                 , creditorSig
//                                                 , creditorSigValid
//                                                 , debtorSig
//                                                 , debtorSigValid
//                                                 )
//     Where (funcIdText, rest) = T.splitAt 8 $ stripHexPrefix inputData
//           (ucacIdText, rest1) = T.splitAt 64 rest
//           (creditorText', rest2) = T.splitAt 64 rest1
//           CreditorText = T.drop 24 creditorText'
//           (debtorText', rest3) = T.splitAt 64 rest2
//           DebtorText = T.drop 24 debtorText'
//           (amountText, rest4) = T.splitAt 64 rest3
//           (creditorSig', rest5) = T.splitAt 192 rest4
//           ParseSig (x, y) = T.append x $ T.drop 62 y
//           CreditorSig = parseSig $ T.splitAt 128 creditorSig'
//           (debtorSig', rest6) = T.splitAt 192 rest5
//           DebtorSig = parseSig $ T.splitAt 128 debtorSig'
//           Memo = T.decodeUtf8 . fst . BS16.decode $ T.encodeUtf8 $ T.take 64 rest6
//           CreditLog = IssueCreditLog (textToAddress $ T.drop 24 ucacIdText)
//                                      (textToAddress creditorText)
//                                      (textToAddress debtorText)
//                                      (hexToInteger amountText)
//                                      Nonce
//                                      Memo
//           MessageHash = EU.hashPersonalMessage $ hashCreditLog creditLog
//           CreditorSigValid = Right creditorText == EU.ecrecover creditorSig messageHash
//           DebtorSigValid = Right debtorText == EU.ecrecover debtorSig messageHash
//# sourceMappingURL=credit.protocol.util.js.map
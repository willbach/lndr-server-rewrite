"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PORT = 7402;
var app = require('express')();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());
// Controllers
var balance_controller_1 = require("./controllers/balance.controller");
var config_controller_1 = require("./controllers/config.controller");
var friends_controller_1 = require("./controllers/friends.controller");
var identity_controller_1 = require("./controllers/identity.controller");
var nonce_controller_1 = require("./controllers/nonce.controller");
var notifications_controller_1 = require("./controllers/notifications.controller");
var paypal_controller_1 = require("./controllers/paypal.controller");
var settlement_controller_1 = require("./controllers/settlement.controller");
var transaction_controller_1 = require("./controllers/transaction.controller");
var user_controller_1 = require("./controllers/user.controller");
// :> Capture "user" Address :> Get '[JSON] [Address]
app.get('/counterparties/:address', balance_controller_1.default.getCounterParties);
// :> Capture "p1" Address :> Capture "p2" Address :> QueryParam "currency" Text :> Get '[JSON] Integer
app.get('/balance/:address1/:address2', balance_controller_1.default.getTwoPartyBalance);
// :> Capture "user" Address :> QueryParam "currency" Text :> Get '[JSON] Integer
app.get('/balance/:address', balance_controller_1.default.getBalance);
// :> Get '[JSON] ConfigResponse
app.get('/config', config_controller_1.default.getConfig);
// :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get('/friends/:address', friends_controller_1.default.getFriendList);
// :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get('/friend_requests/:address', friends_controller_1.default.getFriendRequests);
// :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get('/outbound_friend_requests/:address', friends_controller_1.default.getOutboudFriendRequests);
// :> Capture "user" Address :> ReqBody '[JSON] [Address] :> PostNoContent '[JSON] NoContent
app.post('/add_friends/:address', friends_controller_1.default.addFriends);
// :> Capture "user" Address :> ReqBody '[JSON] [Address] :> PostNoContent '[JSON] NoContent
app.post('/remove_friends/:address', friends_controller_1.default.removeFriends);
// :> ReqBody '[JSON] IdentityVerificationRequest :> PostNoContent '[JSON] NoContent
app.post('/verify_identity', identity_controller_1.default.registerUser);
// :> QueryParam "digest" Text :> ReqBody '[RawJSON] LT.Text :> PostNoContent '[JSON] NoContent
app.post('/verify_identity_callback', identity_controller_1.default.handleCallback);
// :> ReqBody '[JSON] VerificationStatusRequest :> Post '[JSON] VerificationStatusEntry
app.post('/check_verification_status', identity_controller_1.default.checkStatus);
// :> Capture "p1" Address :> Capture "p2" Address :> Get '[JSON] Nonce
app.get('/nonce/:address1/:address2', nonce_controller_1.default.getNonce);
// :> ReqBody '[JSON] PushRequest :> PostNoContent '[JSON] NoContent
app.post('/register_push', notifications_controller_1.default.registerChannelID);
// :> ReqBody '[JSON] PushRequest :> PostNoContent '[JSON] NoContent
app.post('/unregister_push', notifications_controller_1.default.unregisterChannelID);
// :> ReqBody '[JSON] PayPalRequest :> PostNoContent '[JSON] NoContent
app.post('/request_paypal', paypal_controller_1.default.requestPayPal);
// :> Capture "user" Address :> Get '[JSON] [PayPalRequestPair]
app.get('/request_paypal/:address', paypal_controller_1.default.getPayPalRequests);
// :> ReqBody '[JSON] PayPalRequest :> PostNoContent '[JSON] NoContent
app.post('/remove_paypal_request', paypal_controller_1.default.deletePayPalRequest);
// :> Capture "user" Address :> Get '[JSON] SettlementsResponse
app.get('/pending_settlements/:address', settlement_controller_1.default.getPendingSettlements);
// :> ReqBody '[JSON] VerifySettlementRequest :> PostNoContent '[JSON] NoContent
app.post('/verify_settlement', settlement_controller_1.default.verifySettlement);
// :> Capture "hash" Text :> Get '[JSON] Text   get the ETH tx hash using the credit hash
app.get('/tx_hash/:creditHash', settlement_controller_1.default.getTxHash);
// :> ReqBody '[JSON] CreditRecord :> PostNoContent '[JSON] NoContent
app.post('/lend', transaction_controller_1.default.createTransaction);
// :> ReqBody '[JSON] CreditRecord :> PostNoContent '[JSON] NoContent
app.post('/borrow', transaction_controller_1.default.createTransaction);
// :> ReqBody '[JSON] [CreditRecord] :> PostNoContent '[JSON] NoContent
app.post('/multi_settlement', transaction_controller_1.default.submitMultiSettlement);
// :> ReqBody '[JSON] RejectRequest :> PostNoContent '[JSON] NoContent
app.post('/reject', transaction_controller_1.default.reject);
// :> QueryParam "user" Address :> Get '[JSON] [IssueCreditLog]
app.get('/transactions', transaction_controller_1.default.getTransactions);
// :> Capture "user" Address :> Get '[JSON] [CreditRecord]
app.get('/pending/:address', transaction_controller_1.default.getPendingTransactions);
// :> Capture "user" Address :> Get '[JSON] Text
app.get('/nick/:address', user_controller_1.default.getNickname);
// :> ReqBody '[JSON] NickRequest :> PostNoContent '[JSON] NoContent
app.post('/nick', user_controller_1.default.setNickname);
// :> Capture "nick" Text :> Get '[JSON] [UserInfo]
app.get('/search_nick/:nick', user_controller_1.default.searchNicknames);
// :> ReqBody '[JSON] EmailRequest :> PostNoContent '[JSON] NoContent
app.post('/email', user_controller_1.default.setEmail);
// :> Capture "user" Address :> Get '[JSON] EmailAddress
app.get('/email/:address', user_controller_1.default.getEmail);
// :> ReqBody '[JSON] ProfilePhotoRequest :> PostNoContent '[JSON] NoContent
app.post('/profile_photo', user_controller_1.default.setProfilePhoto);
// :> QueryParam "email" EmailAddress :> QueryParam "nick" Nick :> Get '[JSON] UserInfo
app.get('/user', user_controller_1.default.getUserInfo);
// Error handling
var notFoundErrorCode = 404;
var serverErrorCode = 503;
app.use(function (_req, res, _next) { return res.status(notFoundErrorCode).send('Resource Not Found'); });
app.use(function (err, _req, res, _next) {
    console.error(err.stack);
    res.status(serverErrorCode).send('Server Error');
});
app.listen(PORT, function () { return console.error("Listening on PORT " + PORT); });
module.exports = app;
//# sourceMappingURL=server.js.map
const PORT = 7402
const app = require('express')()

import bodyParser from 'body-parser'

app.use(bodyParser.urlencoded({extended: true}), bodyParser.json())

//controllers
import balanceController from 'controllers/balance.controller'
import configController from 'controllers/config.controller'
import friendsController from 'controllers/friends.controller'
import identityController from 'controllers/identity.controller'
import nonceController from 'controllers/nonce.controller'
import notificationsController from 'controllers/notifications.controller'
import paypalController from 'controllers/paypal.controller'
import settlementController from 'controllers/settlement.controller'
import transactionController from 'controllers/transaction.controller'
import userController from 'controllers/user.controller'

//routes
app.get("/counterparties/:address", balanceController.getCounterParties) // :> Capture "user" Address :> Get '[JSON] [Address]
app.get("/balance/:address1/:address2", balanceController.getTwoPartyBalance) // :> Capture "p1" Address :> Capture "p2" Address :> QueryParam "currency" Text :> Get '[JSON] Integer
app.get("/balance/:address", balanceController.getBalance) // :> Capture "user" Address :> QueryParam "currency" Text :> Get '[JSON] Integer

app.get("/config", configController.getConfig) // :> Get '[JSON] ConfigResponse

app.get("/friends/:address", friendsController.getFriendList) // :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get("/friend_requests/:address", friendsController.getFriendRequests) // :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get("/outbound_friend_requests/:address", friendsController.getOutboudFriendRequests) // :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.post("/add_friends/:address", friendsController.addFriends) // :> Capture "user" Address :> ReqBody '[JSON] [Address] :> PostNoContent '[JSON] NoContent
app.post("/remove_friends/:address", friendsController.removeFriends) // :> Capture "user" Address :> ReqBody '[JSON] [Address] :> PostNoContent '[JSON] NoContent

app.post("/verify_identity", identityController.registerUser) // :> ReqBody '[JSON] IdentityVerificationRequest :> PostNoContent '[JSON] NoContent
app.post("/verify_identity_callback", identityController.handleCallback) // :> QueryParam "digest" Text :> ReqBody '[RawJSON] LT.Text :> PostNoContent '[JSON] NoContent
app.post("/check_verification_status", identityController.checkStatus) // :> ReqBody '[JSON] VerificationStatusRequest :> Post '[JSON] VerificationStatusEntry

app.get("/nonce/:address1/:address2", nonceController.getNonce) // :> Capture "p1" Address :> Capture "p2" Address :> Get '[JSON] Nonce

app.post("/register_push", notificationsController.registerChannelID) // :> ReqBody '[JSON] PushRequest :> PostNoContent '[JSON] NoContent
app.post("/unregister_push", notificationsController.unregisterChannelID) // :> ReqBody '[JSON] PushRequest :> PostNoContent '[JSON] NoContent

app.post("/request_paypal", paypalController.requestPayPal) // :> ReqBody '[JSON] PayPalRequest :> PostNoContent '[JSON] NoContent
app.get("/request_paypal/:address", paypalController.getPayPalRequests) // :> Capture "user" Address :> Get '[JSON] [PayPalRequestPair]
app.post("/remove_paypal_request", paypalController.deletePayPalRequest) // :> ReqBody '[JSON] PayPalRequest :> PostNoContent '[JSON] NoContent

app.get("/pending_settlements/:address", settlementController.getPendingSettlements) // :> Capture "user" Address :> Get '[JSON] SettlementsResponse
app.post("/verify_settlement", settlementController.verifySettlement) // :> ReqBody '[JSON] VerifySettlementRequest :> PostNoContent '[JSON] NoContent
app.get("/tx_hash/:creditHash", settlementController.getTxHash) // :> Capture "hash" Text :> Get '[JSON] Text   get the ETH tx hash using the credit hash

app.post("/lend", transactionController.createTransaction) // :> ReqBody '[JSON] CreditRecord :> PostNoContent '[JSON] NoContent
app.post("/borrow", transactionController.createTransaction) // :> ReqBody '[JSON] CreditRecord :> PostNoContent '[JSON] NoContent
app.post("/multi_settlement", transactionController.submitMultiSettlement) // :> ReqBody '[JSON] [CreditRecord] :> PostNoContent '[JSON] NoContent
app.post("/reject", transactionController.reject) // :> ReqBody '[JSON] RejectRequest :> PostNoContent '[JSON] NoContent
app.get("/transactions/:address", transactionController.getTransactions) // :> QueryParam "user" Address :> Get '[JSON] [IssueCreditLog]
app.get("/pending/:address", transactionController.getPendingTransactions) // :> Capture "user" Address :> Get '[JSON] [CreditRecord]

app.post("/nick", userController.setNickname) // :> ReqBody '[JSON] NickRequest :> PostNoContent '[JSON] NoContent
app.get("/nick/:address", userController.getNickname) // :> Capture "user" Address :> Get '[JSON] Text
app.get("/search_nick/:nick", userController.searchNicknames) // :> Capture "nick" Text :> Get '[JSON] [UserInfo]
app.post("/email", userController.setEmail) // :> ReqBody '[JSON] EmailRequest :> PostNoContent '[JSON] NoContent
app.get("/email/:address", userController.getEmail) // :> Capture "user" Address :> Get '[JSON] EmailAddress
app.post("/profile_photo", userController.setProfilePhoto) // :> ReqBody '[JSON] ProfilePhotoRequest :> PostNoContent '[JSON] NoContent
app.get("/user", userController.getUserInfo) // :> QueryParam "email" EmailAddress :> QueryParam "nick" Nick :> Get '[JSON] UserInfo

//error handling
app.use( (_req, res, _next) => res.status(404).send("Resource Not Found") )

app.use( (err, _req, res, _next) => {
    console.error(err.stack)
    res.status(500).send('Server Error')
})

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))

module.exports = app

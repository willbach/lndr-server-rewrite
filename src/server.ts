const PORT = 7402
const app = require('express')()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json())

// Controllers
import balanceController from './controllers/balance.controller'
import configController from './controllers/config.controller'
import friendsController from './controllers/friends.controller'
import identityController from './controllers/identity.controller'
import nonceController from './controllers/nonce.controller'
import notificationsController from './controllers/notifications.controller'
import paypalController from './controllers/paypal.controller'
import settlementController from './controllers/settlement.controller'
import transactionController from './controllers/transaction.controller'
import userController from './controllers/user.controller'

// :> Capture "user" Address :> Get '[JSON] [Address]
app.get('/counterparties/:address', balanceController.getCounterParties)
// :> Capture "p1" Address :> Capture "p2" Address :> QueryParam "currency" Text :> Get '[JSON] Integer
app.get('/balance/:address1/:address2', balanceController.getTwoPartyBalance)
// :> Capture "user" Address :> QueryParam "currency" Text :> Get '[JSON] Integer
app.get('/balance/:address', balanceController.getBalance)

// :> Get '[JSON] ConfigResponse
app.get('/config', configController.getConfig)

// :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get('/friends/:address', friendsController.getFriendList)
// :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get('/friend_requests/:address', friendsController.getFriendRequests)
// :> Capture "user" Address :> Get '[JSON] [UserInfo]
app.get('/outbound_friend_requests/:address', friendsController.getOutboudFriendRequests)
// :> Capture "user" Address :> ReqBody '[JSON] [Address] :> PostNoContent '[JSON] NoContent
app.post('/add_friends/:address', friendsController.addFriends)
// :> Capture "user" Address :> ReqBody '[JSON] [Address] :> PostNoContent '[JSON] NoContent
app.post('/remove_friends/:address', friendsController.removeFriends)

// :> ReqBody '[JSON] IdentityVerificationRequest :> PostNoContent '[JSON] NoContent
app.post('/verify_identity', identityController.registerUser)
// :> QueryParam "digest" Text :> ReqBody '[RawJSON] LT.Text :> PostNoContent '[JSON] NoContent
app.post('/verify_identity_callback', identityController.handleCallback)
// :> ReqBody '[JSON] VerificationStatusRequest :> Post '[JSON] VerificationStatusEntry
app.post('/check_verification_status', identityController.checkStatus)

// :> Capture "p1" Address :> Capture "p2" Address :> Get '[JSON] Nonce
app.get('/nonce/:address1/:address2', nonceController.getNonce)

// :> ReqBody '[JSON] PushRequest :> PostNoContent '[JSON] NoContent
app.post('/register_push', notificationsController.registerChannelID)
// :> ReqBody '[JSON] PushRequest :> PostNoContent '[JSON] NoContent
app.post('/unregister_push', notificationsController.unregisterChannelID)

// :> ReqBody '[JSON] PayPalRequest :> PostNoContent '[JSON] NoContent
app.post('/request_paypal', paypalController.requestPayPal)
// :> Capture "user" Address :> Get '[JSON] [PayPalRequestPair]
app.get('/request_paypal/:address', paypalController.getPayPalRequests)
// :> ReqBody '[JSON] PayPalRequest :> PostNoContent '[JSON] NoContent
app.post('/remove_paypal_request', paypalController.deletePayPalRequest)

// :> Capture "user" Address :> Get '[JSON] SettlementsResponse
app.get('/pending_settlements/:address', settlementController.getPendingSettlements)
// :> ReqBody '[JSON] VerifySettlementRequest :> PostNoContent '[JSON] NoContent
app.post('/verify_settlement', settlementController.verifySettlement)
// :> Capture "hash" Text :> Get '[JSON] Text   get the ETH tx hash using the credit hash
app.get('/tx_hash/:creditHash', settlementController.getTxHash)

// :> ReqBody '[JSON] CreditRecord :> PostNoContent '[JSON] NoContent
app.post('/lend', transactionController.createTransaction)
// :> ReqBody '[JSON] CreditRecord :> PostNoContent '[JSON] NoContent
app.post('/borrow', transactionController.createTransaction)
// :> ReqBody '[JSON] [CreditRecord] :> PostNoContent '[JSON] NoContent
app.post('/multi_settlement', transactionController.submitMultiSettlement)
// :> ReqBody '[JSON] RejectRequest :> PostNoContent '[JSON] NoContent
app.post('/reject', transactionController.reject)
// :> QueryParam "user" Address :> Get '[JSON] [IssueCreditLog]
app.get('/transactions', transactionController.getTransactions)
// :> Capture "user" Address :> Get '[JSON] [CreditRecord]
app.get('/pending/:address', transactionController.getPendingTransactions)

// :> Capture "user" Address :> Get '[JSON] Text
app.get('/nick/:address', userController.getNickname)
// :> ReqBody '[JSON] NickRequest :> PostNoContent '[JSON] NoContent
app.post('/nick', userController.setNickname)
// :> Capture "nick" Text :> Get '[JSON] [UserInfo]
app.get('/search_nick/:nick', userController.searchNicknames)
// :> ReqBody '[JSON] EmailRequest :> PostNoContent '[JSON] NoContent
app.post('/email', userController.setEmail)
// :> Capture "user" Address :> Get '[JSON] EmailAddress
app.get('/email/:address', userController.getEmail)
// :> ReqBody '[JSON] ProfilePhotoRequest :> PostNoContent '[JSON] NoContent
app.post('/profile_photo', userController.setProfilePhoto)
// :> QueryParam "email" EmailAddress :> QueryParam "nick" Nick :> Get '[JSON] UserInfo
app.get('/user', userController.getUserInfo)

// Error handling
const notFoundErrorCode = 404
const serverErrorCode = 503
app.use((_req, res, _next) => res.status(notFoundErrorCode).send('Resource Not Found'))

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(serverErrorCode).send('Server Error')
})

app.listen(PORT, () => console.error(`Listening on PORT ${PORT}`))

module.exports = app

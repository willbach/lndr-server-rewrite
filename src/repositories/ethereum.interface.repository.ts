import db from 'src/db'

export default {
    lndrWeb3: () => {
        // lndrWeb3 :: Web3 b -> LndrHandler b
        // lndrWeb3 web3Action = do
        //     configTVar <- asks serverConfig
        //     config <- liftIO . atomically $ readTVar configTVar
        //     let provider = HttpProvider (web3Url config)
        //     ioEitherToLndr $ runWeb3' provider web3Action

    },

    finalizeTransaction: () => {
        // finalizeTransaction :: TVar ServerConfig -> BilateralCreditRecord
        //                     -> LndrHandler TxHash
        // finalizeTransaction configTVar (BilateralCreditRecord (CreditRecord creditor debtor amount memo _ _ _ _ ucac _ _ _) sig1 sig2 _) = do

        //     config <- liftIO . atomically $ do
        //         config <- readTVar configTVar
        //         -- increment the execution account's nonce
        //         modifyTVar' configTVar (\x -> x { executionNonce = succ (executionNonce config)})
        //         pure config

        //     let execNonce = executionNonce config
        //         callVal = def { callFrom = Just $ executionAddress config
        //                         , callTo = creditProtocolAddress config
        //                         , callGasPrice = Just . Quantity $ gasPrice config
        //                         , callValue = Just . Quantity $ 0
        //                         , callGas = Just . Quantity $ maxGas config
        //                         }
        //         chainId = 1 -- 1 is the mainnet chainId
        //         (sig1r, sig1s, sig1v) = decomposeSig sig1
        //         (sig2r, sig2s, sig2v) = decomposeSig sig2
        //         encodedMemo :: BytesN 32
        //         encodedMemo = BytesN . BA.convert . T.encodeUtf8 $ memo
        //         issueCreditCall = issueCredit callVal
        //                                         ucac
        //                                         creditor debtor (UIntN amount)
        //                                         (sig1r :< sig1s :< sig1v :< NilL)
        //                                         (sig2r :< sig2s :< sig2v :< NilL)
        //                                         encodedMemo

        //     rawTx <- maybe (throwError (err500 {errBody = "Error generating txData."}))
        //                     pure $ createRawTransaction issueCreditCall
        //                                                 execNonce chainId
        //                                                 (executionPrivateKey config)
        //     result <- lndrWeb3 $ Eth.sendRawTransaction rawTx
        //     pure result
    },

    lndrLogs: () => {
        // -- | Scan blockchain for 'IssueCredit' events emitted by the Credit Protocol
        // -- smart contract. If 'Just addr' values are passed in for either 'creditorM'
        // -- or 'debtorM', or both, logs are filtered to show matching results.
        // lndrLogs :: ServerConfig -> Text -> Maybe Address -> Maybe Address
        //         -> Web3 [IssueCreditLog]
        // lndrLogs config currencyKey creditorM debtorM = rights . fmap interpretUcacLog <$>
        //     Eth.getLogs (Filter (Just $ creditProtocolAddress config)
        //                         (Just [ Just (issueCreditEvent config)
        //                             -- TODO this will have to change once we deploy
        //                             -- multiple lndr ucacs
        //                             , addressToBytes32 <$> B.lookup currencyKey (lndrUcacAddrs config)
        //                             , addressToBytes32 <$> creditorM
        //                             , addressToBytes32 <$> debtorM ])
        //                         (BlockWithNumber . BlockNumber $ scanStartBlock config)
        //                         Latest)
    },

    interpretUcacLog: () => {
        // -- | Parse a log 'Change' into an 'IssueCreditLog' if possible.
        // interpretUcacLog :: Change -> Either SomeException IssueCreditLog
        // interpretUcacLog change = do
        //     ucacAddr <- bytes32ToAddress <=< (!! 1) $ changeTopics change
        //     creditorAddr <- bytes32ToAddress <=< (!! 2) $ changeTopics change
        //     debtorAddr <- bytes32ToAddress <=< (!! 3) $ changeTopics change
        //     let amount = hexToInteger . takeNthByte32 0 $ changeData change
        //         nonce = hexToInteger . takeNthByte32 1 $ changeData change
        //         memo = T.decodeUtf8 . fst . BS16.decode
        //                             . T.encodeUtf8 . takeNthByte32 2 $ changeData change
        //     pure $ IssueCreditLog ucacAddr
        //                         creditorAddr
        //                         debtorAddr
        //                         amount
        //                         nonce
        //                         memo
    },

    verifySettlementPayment: () => {
        // -- | Verify that a settlement payment was made using a 'txHash' corresponding to
        // -- an Ethereum transaction on the blockchain and the associated addresses and
        // -- eth settlement amount.
        // verifySettlementPayment :: TransactionHash -> Address -> Address -> Integer -> LndrHandler ()
        // verifySettlementPayment txHash creditorAddr debtorAddr settlementValue = do
        //     transactionM <- lndrWeb3 . Eth.getTransactionByHash $ addHexPrefix txHash
        //     case transactionM of
        //         (Just transaction) ->
        //             let fromMatch = txFrom transaction == creditorAddr
        //                 toMatch = txTo transaction == Just debtorAddr
        //                 transactionValue = hexToInteger $ txValue transaction
        //                 valueMatch = transactionValue == settlementValue
        //             in case (fromMatch, toMatch, valueMatch) of
        //                 (False, _, _)      -> lndrError $ "Bad from match, hash: " ++ T.unpack txHash
        //                 (_, False, _)      -> lndrError $ "Bad to match, hash: " ++ T.unpack txHash
        //                 (_, _, False)      -> lndrError $ "Bad value match, hash: " ++ T.unpack txHash
        //                                                 ++ "tx value: " ++ show transactionValue
        //                                                 ++ ", settlementValue: " ++ show settlementValue
        //                 (True, True, True) -> pure ()
        //         Nothing -> lndrError $ "transaction not found, tx_hash: " ++ T.unpack txHash
    },

    currentBlockNumber: () => {
        // currentBlockNumber :: ServerConfig -> MaybeT IO Integer
        // currentBlockNumber config = do
        //     let provider = HttpProvider (web3Url config)
        //     blockNumberTextE <- runWeb3' provider Eth.blockNumber
        //     return $ case blockNumberTextE of
        //         Right (BlockNumber number) -> number
        //         Left _        -> 0

    },

    currentExecutionNonce: () => {
        // currentExecutionNonce :: ServerConfig -> MaybeT IO Integer
        // currentExecutionNonce config = do
        //     let provider = HttpProvider (web3Url config)
        //     nonceE <- runWeb3' provider $ Eth.getTransactionCount (executionAddress config) Latest
        //     return $ case nonceE of
        //         Right (Quantity number) -> number
        //         Left  _                 -> 0
    }
}

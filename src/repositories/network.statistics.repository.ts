import db from '../db'

export default {
    querySafelow: () => {
        // querySafelow :: MaybeT IO Integer
        // querySafelow = do
        //     req <- lift $ HTTP.parseRequest "https://ethgasstation.info/json/ethgasAPI.json"
        //     gasStationResponse <- MaybeT $ rightToMaybe . HTTP.getResponseBody <$> HTTP.httpJSONEither req
        //     return . ceiling $ margin * safeLowScaling * safeLow gasStationResponse
        //     where
        //         safeLowScaling = 100000000 -- eth gas station returns prices in DeciGigaWei
        //         margin = 1.7 -- multiplier for additional assurance that tx will make it into blockchain
    },

    queryEtheruemPrices: () => {
        // queryEtheruemPrices :: MaybeT IO EthereumPrices
        // queryEtheruemPrices = do
        //     req <- lift $ HTTP.parseRequest "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
        //     MaybeT $ rightToMaybe . HTTP.getResponseBody <$> HTTP.httpJSONEither req

    }
}

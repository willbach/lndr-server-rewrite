const request = require('request-promise')

export default {
    querySafelow: async() => {
        const options = {
            uri: `https://ethgasstation.info/json/ethgasAPI.json`,
            json: true // Automatically parses the JSON string in the response
        }
        
        const result = await request(options)

        const safeLowScaling = 100000000
        const margin = 1.7

        return Math.ceil(result.safeLow * safeLowScaling * margin)
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
        const options = {
            uri: `https://api.coinbase.com/v2/exchange-rates?currency=ETH`,
            json: true // Automatically parses the JSON string in the response
        }

        return request(options)
        // queryEtheruemPrices :: MaybeT IO EthereumPrices
        // queryEtheruemPrices = do
        //     req <- lift $ HTTP.parseRequest "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
        //     MaybeT $ rightToMaybe . HTTP.getResponseBody <$> HTTP.httpJSONEither req
    }
}

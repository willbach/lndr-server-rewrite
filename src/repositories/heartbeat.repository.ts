const request = require('request-promise')

export default {
  queryEtheruemPrices: () => {
    const options = {
      json: true,
      uri: 'https://api.coinbase.com/v2/exchange-rates?currency=ETH'
    }

    return request(options)
    // QueryEtheruemPrices :: MaybeT IO EthereumPrices
    // QueryEtheruemPrices = do
    //     Req <- lift $ HTTP.parseRequest "https://api.coinbase.com/v2/exchange-rates?currency=ETH"
    //     MaybeT $ rightToMaybe . HTTP.getResponseBody <$> HTTP.httpJSONEither req
  },

  querySafelow: async () => {
    const options = {
      json: true,
      uri: 'https://ethgasstation.info/json/ethgasAPI.json'
    }

    const result = await request(options)

    const safeLowScaling = 100000000
    const margin = 1.7

    return Math.ceil(result.safeLow * safeLowScaling * margin)
    // QuerySafelow :: MaybeT IO Integer
    // QuerySafelow = do
    //     Req <- lift $ HTTP.parseRequest "https://ethgasstation.info/json/ethgasAPI.json"
    //     GasStationResponse <- MaybeT $ rightToMaybe . HTTP.getResponseBody <$> HTTP.httpJSONEither req
    //     Return . ceiling $ margin * safeLowScaling * safeLow gasStationResponse
    //     Where
    //         SafeLowScaling = 100000000 -- eth gas station returns prices in DeciGigaWei
    //         Margin = 1.7 -- multiplier for additional assurance that tx will make it into blockchain
  }
}

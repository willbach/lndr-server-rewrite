export default class ConfigResponse {
  lndrAddresses: any
  creditProtocolAddress: string
  gasPrice: number
  ethereumPrices: any
  weekAgoBlock: number

  constructor(data) {
    this.lndrAddresses = data.lndrAddresses
    this.creditProtocolAddress = data.creditProtocolAddress
    this.gasPrice = data.gasPrice
    this.ethereumPrices = data.ethereumPrices
    this.weekAgoBlock = data.weekAgoBlock
  }
}

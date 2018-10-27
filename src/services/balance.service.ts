import verifiedRepository from '../repositories/verified.repository'
import configService from '../services/config.service'

export default {
  getCounterParties: (address: string) => {
    return verifiedRepository.getCounterParties(address)
  },

  getTwoPartyBalance: async(address1: string, address2: string, currency: string) => {
    const ucac = await configService.getUcac(currency)
    return verifiedRepository.getTwoPartyBalance(address1, address2, ucac.slice(2))
  },

  getBalance: async(address: string, currency: string) => {
    const ucac = await configService.getUcac(currency)
    return verifiedRepository.getBalance(address, ucac.slice(2))
  }
}

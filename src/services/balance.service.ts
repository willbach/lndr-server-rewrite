import configService from '../services/config.service'
import verifiedRepository from '../repositories/verified.repository'

export default {
  getBalance: async (address: string, currency: string) => {
    const ucac = await configService.getUcac(currency)
    return verifiedRepository.getBalance(address, ucac.slice(2))
  },

  getCounterParties: (address: string) => verifiedRepository.getCounterParties(address),

  getTwoPartyBalance: async (address1: string, address2: string, currency: string) => {
    const ucac = await configService.getUcac(currency)
    return verifiedRepository.getTwoPartyBalance(address1, address2, ucac.slice(2))
  }
}

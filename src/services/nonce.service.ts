import verifiedRepository from '../repositories/verified.repository'

export default {
  getNonce: (address: string, counterparty: string) => {
    return verifiedRepository.getNonce(address, counterparty)
  }
}

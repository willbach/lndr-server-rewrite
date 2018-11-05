import verifiedRepository from '../repositories/verified.repository'

export default {
  getNonce: (address: string, counterparty: string) => verifiedRepository.getNonce(address, counterparty)
}

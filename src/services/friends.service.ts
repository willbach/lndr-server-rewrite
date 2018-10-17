import friendsRepository from '../repositories/friends.repository'

export default {
  getFriendList: (address: string) => {
    return friendsRepository.lookupFriends(address)
  },

  getFriendRequests: (address: string) => {
    return friendsRepository.lookupInboundFriendRequests(address)
  },

  getOutboudFriendRequests: (address: string) => {
    return friendsRepository.lookupOutboundFriendRequests(address)
  },

  addFriends: (address: string, friendList: [string]) => {
    return Promise.all(friendList.map(friend => friendsRepository.addFriends(address, friend)))
  },

  removeFriends: (address: string, friendList: [string]) => {
    return friendsRepository.removeFriends(address, friendList)
  }
}

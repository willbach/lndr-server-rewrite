import friendsRepository from '../repositories/friends.repository'

export default {
  addFriends: (address: string, friendList: [string]) => Promise.all(friendList.map((friend) => friendsRepository.addFriends(address, friend))),

  getFriendList: (address: string) => friendsRepository.lookupFriends(address),

  getFriendRequests: (address: string) => friendsRepository.lookupInboundFriendRequests(address),

  getOutboudFriendRequests: (address: string) => friendsRepository.lookupOutboundFriendRequests(address),

  removeFriends: (address: string, friendList: [string]) => friendsRepository.removeFriends(address, friendList)
}

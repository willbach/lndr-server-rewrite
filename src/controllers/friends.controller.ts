import friendsService from '../services/friends.service'

export default {
  getFriendList: (req, res) => {
    friendsService.getFriendList(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[GET] /friends', err)
        res.status(400).json(err)
      })
  },

  getFriendRequests: (req, res) => {
    friendsService.getFriendRequests(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[GET] /friend_requests', err)
        res.status(400).json(err)
      })
  },

  getOutboudFriendRequests: (req, res) => {
    friendsService.getOutboudFriendRequests(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[GET] /outbound_friend_requests', err)
        res.status(400).json(err)
      })
  },

  addFriends: (req, res) => {
    friendsService.addFriends(req.params.address, req.body)
      .then( () => {
        res.status(204).end()
      })
      .catch(err => {
        console.log('[POST] /add_friends', err)
        res.status(400).json(err)
      })
  },

  removeFriends: (req, res) => {
    friendsService.removeFriends(req.params.address, req.body)
      .then( () => {
        res.status(204).end()
      })
      .catch(err => {
        console.log('[POST] /remove_friends', err)
        res.status(400).json(err)
      })
  }
}

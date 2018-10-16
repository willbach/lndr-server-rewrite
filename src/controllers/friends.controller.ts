import friendsService from 'services/friends.service'

export default {
  getFriendList: (req, res) => {
    friendsService.getFriendList(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getFriendRequests: (req, res) => {
    friendsService.getFriendRequests(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getOutboudFriendRequests: (req, res) => {
    friendsService.getOutboudFriendRequests(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  addFriends: (req, res) => {
    friendsService.addFriends(req.params.address, req.body)
      .then( () => {
        res.status(204).end()
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  removeFriends: (req, res) => {
    friendsService.removeFriends(req.params.address, req.body)
      .then( () => {
        res.status(204).end()
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}

import { badRequest, notFound, successNoContent } from '../utils/http.codes'

import friendsService from '../services/friends.service'

export default {
  addFriends: (req, res) => {
    friendsService.addFriends(req.params.address, req.body)
      .then(() => {
        res.status(successNoContent).end()
      })
      .catch((err) => {
        console.error('[POST] /add_friends', err)
        res.status(badRequest).json(err)
      })
  },

  getFriendList: (req, res) => {
    friendsService.getFriendList(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /friends', err)
        res.status(notFound).json(err)
      })
  },

  getFriendRequests: (req, res) => {
    friendsService.getFriendRequests(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /friend_requests', err)
        res.status(notFound).json(err)
      })
  },

  getOutboudFriendRequests: (req, res) => {
    friendsService.getOutboudFriendRequests(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /outbound_friend_requests', err)
        res.status(notFound).json(err)
      })
  },

  removeFriends: (req, res) => {
    friendsService.removeFriends(req.params.address, req.body)
      .then(() => {
        res.status(successNoContent).end()
      })
      .catch((err) => {
        console.error('[POST] /remove_friends', err)
        res.status(badRequest).json(err)
      })
  }
}

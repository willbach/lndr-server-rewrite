import { badRequest, notFound, successNoContent, unauthorized } from '../utils/http.codes'

import EmailRequest from '../dto/email-request'
import NickRequest from '../dto/nick-request'
import ProfilePhotoRequest from '../dto/profile-photo-request'
import userService from '../services/user.service'

export default {
  getEmail: (req, res) => {
    userService.getEmail(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /email', err)
        res.status(notFound).json(err)
      })
  },

  getNickname: (req, res) => {
    userService.getNickname(req.params.address)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /nick', err)
        res.status(notFound).json(err)
      })
  },

  getUserInfo: (req, res) => {
    userService.getUserInfo(req.query.email, req.query.nick)
      .then((data) => {
        if (data) {
          res.json(data)
        } else {
          res.status(notFound).end()
        }
      })
      .catch((err) => {
        console.error('[GET] /user: ', err)
        res.status(notFound).json(err)
      })
  },

  searchNicknames: (req, res) => {
    userService.searchNicknames(req.params.nick)
      .then((data) => {
        res.json(data)
      })
      .catch((err) => {
        console.error('[GET] /search_nicknames', err)
        res.status(notFound).json(err)
      })
  },

  setEmail: (req, res) => {
    const emailRequest = new EmailRequest(req.body)
    if (emailRequest.signatureMatches()) {
      userService.setEmail(emailRequest)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /email', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  },

  setNickname: (req, res) => {
    const nickRequest = new NickRequest(req.body)
    if (nickRequest.signatureMatches()) {
      userService.setNickname(nickRequest)
        .then(() => {
          res.status(successNoContent).end()
        })
        .catch((err) => {
          console.error('[POST] /nick', err)
          res.status(badRequest).json(err)
        })
    } else {
      res.status(unauthorized).json('Signature does not match')
    }
  },

  setProfilePhoto: (req, res) => {
    const photoRequest = new ProfilePhotoRequest(req.body)
    userService.setProfilePhoto(photoRequest)
      .then(() => {
        res.status(successNoContent).end()
      })
      .catch((err) => {
        console.error('[POST] /profile_photo', err)
        res.status(badRequest).json(err)
      })
  }
}

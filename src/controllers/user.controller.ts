import userService from '../services/user.service'
import NickRequest from '../dto/nick-request'
import EmailRequest from '../dto/email-request'
import ProfilePhotoRequest from '../dto/profile-photo-request';

export default {
  setNickname: (req, res) => {
    const nickRequest = new NickRequest(req.body)
    if (nickRequest.signatureMatches()) {
      userService.setNickname(nickRequest)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },

  getNickname: (req, res) => {
    userService.getNickname(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  searchNicknames: (req, res) => {
    userService.searchNicknames(req.params.nick)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  setEmail: (req, res) => {
    const emailRequest = new EmailRequest(req.body)
    if (emailRequest.signatureMatches()) {
      userService.setEmail(emailRequest)
        .then(() => {
          res.status(204).end()
        })
        .catch(err => {
          res.status(400).json(err)
        })
    } else {
      res.status(401).json('Signature does not match')
    }
  },

  getEmail: (req, res) => {
    userService.getEmail(req.params.address)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  setProfilePhoto: (req, res) => {
    const photoRequest = new ProfilePhotoRequest(req.body)
    userService.setProfilePhoto(photoRequest)
      .then(() => {
        res.status(204).end()
      })
      .catch(err => {
        res.status(400).json(err)
      })
  },

  getUserInfo: (req, res) => {
    console.log('HERE')
    userService.getUserInfo(req.query.email, req.query.nick)
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        console.log('[GET] /user: ', err)
        res.status(400).json(err)
      })
  }
}

const AWS = require('aws-sdk')

import nicknamesRepository from '../repositories/nicknames.repository'
import NickRequest from '../dto/nick-request'
import EmailRequest from '../dto/email-request'
import ProfilePhotoRequest from '../dto/profile-photo-request'
import configService from '../services/config.service'

AWS.config.update({ accessKeyId: configService.awsAccessKeyId, secretAccessKey: configService.awsSecretAccessKey })

export default {
  setNickname: (request: NickRequest) => {
    return nicknamesRepository.insertNick(request.addr, request.nick)
  },

  getNickname: (address: string) => {
    return nicknamesRepository.lookupNick(address)
  },

  searchNicknames: (nick: string) => {
    return nicknamesRepository.lookupAddressesByFuzzyNick(nick)
  },

  setEmail: (request: EmailRequest) => {
    return nicknamesRepository.insertEmail(request.addr, request.email)
  },

  getEmail: (address: string) => {
    return nicknamesRepository.lookupEmail(address)
  },

  setProfilePhoto: (request: ProfilePhotoRequest) => {
    const address = request.getAddress()

    const params = {
      Body: request.image, 
      Bucket: configService.awsPhotoBucket, 
      Key: `${address}.jpeg`
    }

    const s3 = new AWS.S3({ region: 'us-west-2' })

    return new Promise((resolve, reject) => {
      s3.putObject(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    // photoUploadHandler :: ProfilePhotoRequest -> LndrHandler NoContent
    // photoUploadHandler r@(ProfilePhotoRequest photo sig) = do
    //     configTVar <- asks serverConfig
    //     config <- liftIO $ readTVarIO configTVar
    //     let Right address = recoverSigner r
    //         elementName = Aws.ObjectKey . stripHexPrefix . T.pack $ show address ++ ".jpeg"
    //         body = Aws.toBody . B64.decodeLenient $ T.encodeUtf8 photo
    //         accessKeyId = awsAccessKeyId config
    //         secretAccessKey = awsSecretAccessKey config
    //         bucket = Aws.BucketName $ awsPhotoBucket config
    //     env <- liftIO . Aws.newEnv $ Aws.FromKeys (Aws.AccessKey accessKeyId) (Aws.SecretKey secretAccessKey)
    //     liftIO . runResourceT . Aws.runAWS env . Aws.within Aws.Oregon $
    //         Aws.send (set Aws.poACL (Just Aws.OPublicRead) $ Aws.putObject bucket elementName body)
    //     pure NoContent
  },

  getUserInfo: (email: string, nick: string) => {
    if (email) {
      return nicknamesRepository.lookupAddressByEmail(email)
    } else if (nick) {
      return nicknamesRepository.lookupAddressByNick(nick)
    } else {
      throw new Error('No email or nickname given')
    }
  }
}

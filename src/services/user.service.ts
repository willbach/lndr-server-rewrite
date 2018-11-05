const AWS = require('aws-sdk')

import EmailRequest from '../dto/email-request'
import NickRequest from '../dto/nick-request'
import ProfilePhotoRequest from '../dto/profile-photo-request'
import configService from '../services/config.service'
import nicknamesRepository from '../repositories/nicknames.repository'

AWS.config.update({ accessKeyId: configService.awsAccessKeyId, secretAccessKey: configService.awsSecretAccessKey })

export default {
  getEmail: (address: string) => nicknamesRepository.lookupEmail(address),

  getNickname: (address: string) => nicknamesRepository.lookupNick(address),

  getUserInfo: (email: string, nick: string) => {
    if (email) {
      return nicknamesRepository.lookupAddressByEmail(email)
    } else if (nick) {
      return nicknamesRepository.lookupAddressByNick(nick)
    }
    throw new Error('No email or nickname given')
  },

  searchNicknames: (nick: string) => nicknamesRepository.lookupAddressesByFuzzyNick(nick),

  setEmail: (request: EmailRequest) => nicknamesRepository.insertEmail(request.addr, request.email),

  setNickname: (request: NickRequest) => nicknamesRepository.insertNick(request.addr, request.nick),

  setProfilePhoto: (request: ProfilePhotoRequest) => {
    const address = request.getAddress()

    const params = {
      Body: request.image,
      Bucket: configService.awsPhotoBucket,
      Key: `${address}.jpeg`
    }

    const s3 = new AWS.S3({ region: 'us-west-2' })

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    // PhotoUploadHandler :: ProfilePhotoRequest -> LndrHandler NoContent
    // PhotoUploadHandler r@(ProfilePhotoRequest photo sig) = do
    //     ConfigTVar <- asks serverConfig
    //     Config <- liftIO $ readTVarIO configTVar
    //     Let Right address = recoverSigner r
    //         ElementName = Aws.ObjectKey . stripHexPrefix . T.pack $ show address ++ ".jpeg"
    //         Body = Aws.toBody . B64.decodeLenient $ T.encodeUtf8 photo
    //         AccessKeyId = awsAccessKeyId config
    //         SecretAccessKey = awsSecretAccessKey config
    //         Bucket = Aws.BucketName $ awsPhotoBucket config
    //     Env <- liftIO . Aws.newEnv $ Aws.FromKeys (Aws.AccessKey accessKeyId) (Aws.SecretKey secretAccessKey)
    //     LiftIO . runResourceT . Aws.runAWS env . Aws.within Aws.Oregon $
    //         Aws.send (set Aws.poACL (Just Aws.OPublicRead) $ Aws.putObject bucket elementName body)
    //     Pure NoContent
  }
}

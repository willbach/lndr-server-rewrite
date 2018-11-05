"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require('aws-sdk');
var config_service_1 = require("../services/config.service");
var nicknames_repository_1 = require("../repositories/nicknames.repository");
AWS.config.update({ accessKeyId: config_service_1.default.awsAccessKeyId, secretAccessKey: config_service_1.default.awsSecretAccessKey });
exports.default = {
    getEmail: function (address) { return nicknames_repository_1.default.lookupEmail(address); },
    getNickname: function (address) { return nicknames_repository_1.default.lookupNick(address); },
    getUserInfo: function (email, nick) {
        if (email) {
            return nicknames_repository_1.default.lookupAddressByEmail(email);
        }
        else if (nick) {
            return nicknames_repository_1.default.lookupAddressByNick(nick);
        }
        throw new Error('No email or nickname given');
    },
    searchNicknames: function (nick) { return nicknames_repository_1.default.lookupAddressesByFuzzyNick(nick); },
    setEmail: function (request) { return nicknames_repository_1.default.insertEmail(request.addr, request.email); },
    setNickname: function (request) { return nicknames_repository_1.default.insertNick(request.addr, request.nick); },
    setProfilePhoto: function (request) {
        var address = request.getAddress();
        var params = {
            Body: request.image,
            Bucket: config_service_1.default.awsPhotoBucket,
            Key: address + ".jpeg"
        };
        var s3 = new AWS.S3({ region: 'us-west-2' });
        return new Promise(function (resolve, reject) {
            s3.putObject(params, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
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
};
//# sourceMappingURL=user.service.js.map
import configService from 'services/config.service'

export default {
  getConfig: (req, res) => {
    res.json(configService.getConfigResponse())
  }
}

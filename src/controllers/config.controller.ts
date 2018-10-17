import configService from '../services/config.service'

export default {
  getConfig: (_req, res) => {
    res.json(configService.getConfigResponse())
  }
}

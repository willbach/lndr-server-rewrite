import nonceService from '../services/nonce.service'
import { notFound } from '../utils/http.codes'

export default {
  getNonce: (req, res) => {
    nonceService.getNonce(req.params.address1, req.params.address2)
      .then((nonce) => {
        res.json(nonce)
      })
      .catch((err) => {
        console.error('[GET] /nonce', err)
        res.status(notFound).json(err)
      })
  }
}

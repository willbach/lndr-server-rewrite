import nonceService from 'services/nonce.service'

export default {
  getNonce: (req, res) => {
    nonceService.getNonce(req.params.address1, req.params.address2)
      .then(nonce => {
        res.json(nonce)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }
}

export default class IdentityDocument {
  idDocType: string
  country: string
  file?: string

  constructor(data) {
    this.idDocType = data.idDocType
    this.country = data.country
    this.file = data.file
  }
}

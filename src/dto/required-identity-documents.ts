class IdentityDocumentType {
  idDocSetType: string
  types: [string]
  subTypes?: [string]

  constructor(data) {
    this.idDocSetType = data.idDocSetType
    this.types = data.types
    this.subTypes = data.subTypes
  }
}

export default class RequiredIdentityDocuments {
  country: string
  docSets: [IdentityDocumentType]

  constructor(data) {
    this.country = data.country
    this.docSets = data.docSets.map((set) => new IdentityDocumentType(set))
  }
}

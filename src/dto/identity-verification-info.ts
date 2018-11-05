class IdentityAddress {
  street: string
  flatNumber: string
  town: string
  state: string
  postCode: string
  country: string

  constructor(data) {
    this.street = data.street
    this.flatNumber = data.flatNumber
    this.town = data.town
    this.state = data.state
    this.postCode = data.postCode
    this.country = data.country
  }
}

export default class IdentityVerificationInfo {
  country: string
  firstName: string
  middleName: string
  lastName: string
  phone: string
  dob: string
  nationality: string
  addresses: [IdentityAddress]

  constructor(data) {
    this.country = data.country
    this.firstName = data.firstName
    this.middleName = data.middleName
    this.lastName = data.lastName
    this.phone = data.phone
    this.dob = data.dob
    this.nationality = data.nationality
    this.addresses = data.addresses.map((address) => new IdentityAddress(address))
  }
}

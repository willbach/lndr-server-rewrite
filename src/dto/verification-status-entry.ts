export default class VerificationStatusEntry {
  user: string
  sumsubId: string
  status: string

  constructor(data) {
    this.user = data.address
    this.sumsubId = data.applicant_id
    this.status = data.status
  }
}
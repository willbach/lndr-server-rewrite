export default class VerificationStatusEntry {
  user: string
  sumsubId: string
  status: string

  constructor(data) {
    this.user = data.address
    this.sumsubId = data.applicant_id ? data.applicant_id : data.applicantId
    this.status = data.status
  }
}

export type Me = {
  success: boolean
  message: string
  data: {
    personal_info: {
      id: string
      username: string
      email: string
      phone_number: string
      role: string
    }
  }
}

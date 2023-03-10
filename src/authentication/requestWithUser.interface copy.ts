import { Request } from 'express'

export interface User {
  id: string
  email: string
  // name: string
  password: string
  // isTwoFactorAuthenticationEnabled: boolean
}

interface RequestWithUser extends Request {
  user: User
}

export default RequestWithUser

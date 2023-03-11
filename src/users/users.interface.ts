export interface User {
  id: string
  name: string
  email: string
  password: string
  isTwoFactorAuthEnabled: boolean
  twoFactorAuthSecret?: string
}

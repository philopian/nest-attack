export interface User {
  id: string
  name: string
  email: string
  password: string
  isMfaAuthEnabled: boolean
  mfaAuthSecret?: string
}

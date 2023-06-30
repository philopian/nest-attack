import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class JwtMfaGuard extends AuthGuard('jwt-mfa') {}

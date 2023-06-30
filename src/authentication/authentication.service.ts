import { HttpException, HttpStatus, Injectable, Logger, Body } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UsersService } from '../users/users.service'
import PostgresErrorCode from '../utils/pg-error-codes.enum'
import RegisterDto from './dto/register.dto'
import { MfaAuthenticationService } from './mfa/mfa-auth.service'
import TokenPayload from './tokenPayload.interface'

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name)
  constructor(
    private readonly mfaAuthenticationService: MfaAuthenticationService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(@Body() registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10)
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
        isMfaAuthEnabled: false,
      })

      delete createdUser.password
      this.logger.log('[createdUser]', createdUser)
      return createdUser
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST)
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public getJwtToken(userId: string) {
    const payload: TokenPayload = { userId }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    })
    return accessToken
  }

  public getJwtAccessTokenWithMFA(userId: string, isSecondFactorAuthenticated = false) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    })
    return accessToken
  }

  public getJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId }
    const refreshToken = this.jwtService.sign(payload, {
      // secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    })

    return refreshToken
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const authenticatedUser = await this.usersService.getByEmail(email)
      await this.verifyPassword(plainTextPassword, authenticatedUser.password)
      return authenticatedUser
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword)
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST)
    }
  }
}

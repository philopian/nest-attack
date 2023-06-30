import { IsNotEmpty, IsString } from 'class-validator'

export class MfaAuthenticationCodeDto {
  @IsString()
  @IsNotEmpty()
  mfaAuthenticationCode: string
}

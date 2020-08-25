import { AxiosResponse } from 'axios';
import { unAuthenticatedservice, authenticatedService } from './BaseRepository';
import { RegisterDTO, MailResetPassDTO, LoginDTO, ResetPasswordActionDTO } from '@/constants/app.interface';
import { authEnpoint } from '@/constants/app.constant';

export default class AuthRepository {
  public static register(credentials: RegisterDTO) {
    return unAuthenticatedservice.post(authEnpoint.register, credentials);
  }

  public static login(credentials: LoginDTO) {
    return unAuthenticatedservice.post(authEnpoint.login, credentials);
  }

  public static logout(): Promise<AxiosResponse<void>> {
    return authenticatedService.post(authEnpoint.logout);
  }

  public static sendMailToResetPassword(payload: MailResetPassDTO): Promise<AxiosResponse<void>> {
    return unAuthenticatedservice.post<void>(authEnpoint.resetPassword, payload);
  }

  public static resetPasswordWithToken(data: ResetPasswordActionDTO) {
    return unAuthenticatedservice.put(authEnpoint.resetPassword, data);
  }

  public static verifyLinkInvite(token: string) {
    return unAuthenticatedservice.get(`auth/verification/${token}`);
  }

  public static verifyResetPassword(token: string) {
    return unAuthenticatedservice.get(`${authEnpoint.resetPassword}/${token}`);
  }

  public static generateLinkInivte() {
    return authenticatedService.get(authEnpoint.generateLink);
  }
}

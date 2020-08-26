import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { ChangePasswordDTO } from '@/constants/app.interface';
import { formatDateToYYYY } from '@/utils/dateParser';
export default class UserRepository {
  public static me() {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/me`);
  }

  public static getAdminId() {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/admin`);
  }

  public static getAllUsers() {
    return authenticatedService.get(`${ResourcesEnpoint.Users}/all`);
  }

  public static changePassword(payload: ChangePasswordDTO) {
    return authenticatedService.put(`${ResourcesEnpoint.Users}/me/change_password`, payload);
  }

  public static update(payload: any) {
    const tempProfile = {
      fullName: payload.fullName,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth ? formatDateToYYYY(payload.dateOfBirth) : null,
    };
    return authenticatedService.put(`${ResourcesEnpoint.Users}/me`, tempProfile);
  }
}

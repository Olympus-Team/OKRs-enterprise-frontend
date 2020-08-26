import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { PayloadOkrs } from '@/constants/app.interface';

export default class OkrsRepository {
  /**
   * When the type = 1 --> All Root Okrs
   * When the type = 2 --> All leader Okrs
   * When the type = 3 --> All Okrs, except root okrs
   */
  public static getListOkrs(cycleId: number, type: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/list_okrs?cycleId=${cycleId}&type=${type}`);
  }

  public static getOkrsDetail(okrsId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/detail/${okrsId}`);
  }

  public static getOkrsDashboard(cycleId: number, userId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Objective}/view_list`, { params: { cycleId, userId } });
  }

  public static createOrUpdateOkrs(payload: PayloadOkrs): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.Objective}`, payload);
  }

  public static deleteKr(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.KeyResults}/${id}`);
  }

  public static deleteOkrs(objectiveId: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.Objective}/${objectiveId}`);
  }
}

import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { CycleDTO, AdminParams } from '@/constants/app.interface';

export default class CycleRepository {
  public static get(params: AdminParams): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.CycleOKRs}`, { params });
  }

  public static getMetadata(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.MetaData}/cycles`);
  }

  public static getCurrentCycle(): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.CycleOKRs}/current`);
  }

  public static update(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.CycleOKRs}/${payload.id}`, payload);
  }

  public static post(payload: CycleDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.CycleOKRs}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.CycleOKRs}/${id}`);
  }
}

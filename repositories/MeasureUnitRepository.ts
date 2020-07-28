import { AxiosResponse } from 'axios';
import { unAuthenticatedservice, authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';
import { MeasureUnitDTO } from '@/constants/app.interface';

export default class MeasureUnitRepository {
  public static get() {
    return unAuthenticatedservice.get(`${ResourcesEnpoint.MeasureUnit}`);
  }

  public static update(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.put(`${ResourcesEnpoint.MeasureUnit}/${payload.id}`, payload);
  }

  public static post(payload: MeasureUnitDTO): Promise<AxiosResponse<any>> {
    return authenticatedService.post(`${ResourcesEnpoint.MeasureUnit}`, payload);
  }

  public static delete(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.delete(`${ResourcesEnpoint.MeasureUnit}/${id}`);
  }
}

import { AxiosResponse } from 'axios';
import { authenticatedService } from './BaseRepository';
import { ResourcesEnpoint } from '@/constants/app.enum';

export default class CheckinRepository {
  public static get(params: any) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}`, { params });
  }

  public static getDetail(id: number) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/objective/${id}`);
  }

  public static getRequest(params: any) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/checkin_request`, { params });
  }

  public static getOKRsCompany(params: any) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/admin`, { params });
  }

  public static post(payload: any) {
    return authenticatedService.post(`${ResourcesEnpoint.Checkin}`, payload);
  }

  public static adminCreateCheckin(payload: any) {
    return authenticatedService.post(`${ResourcesEnpoint.Checkin}/admin`, payload);
  }

  public static adminUpdateCheckin(payload: any, id: number) {
    return authenticatedService.put(`${ResourcesEnpoint.Checkin}/admin/${id}`, payload);
  }

  public static staffUpdateCheckin(payload: any, id: number) {
    return authenticatedService.put(`${ResourcesEnpoint.Checkin}/${id}`, payload);
  }

  public static leaderUpdateCheckin(payload: any, id: number) {
    return authenticatedService.put(`${ResourcesEnpoint.Checkin}/checkin_request/${id}`, payload);
  }

  public static getHistory(id: number) {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/history/${id}`);
  }

  public static getDetailCheckin(id: number): Promise<AxiosResponse<any>> {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/${id}`);
  }

  public static getCheckinDetail(checkinId: number): any {
    return authenticatedService.get(`${ResourcesEnpoint.Checkin}/waiting_feedback_detail/${checkinId}`);
  }
}

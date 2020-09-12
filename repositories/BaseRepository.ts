import axios from 'axios';
import { Notification } from 'element-ui';

import { getTokenCookie } from '@/utils/cookies';
import { notificationConfig } from '@/constants/app.constant';

export const unAuthenticatedservice = axios.create({
  baseURL: `${process.env.baseAPI}/api/v1`,
});

export const authenticatedService = axios.create({
  baseURL: `${process.env.baseAPI}/api/v1`,
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
authenticatedService.interceptors.request.use(
  (config) => {
    // Add Bearer token's header to every request
    if (getTokenCookie() !== null) {
      config.headers.Authorization = `Bearer ${getTokenCookie()}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

authenticatedService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    switch (error.response.data.statusCode) {
      case 401:
        window.location.href = '/dang-nhap';
        break;
      case 403:
        Notification.error({
          ...notificationConfig,
          message: 'Bạn không có quyền truy cập vào khu vực này',
        });
        break;
      case 404:
        window.location.href = `${process.env.baseURL}/404`;
        break;
      case 440: // error already exist instance
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 490: // DB logic error
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 495: // DB Constraint
        Notification.error({
          ...notificationConfig,
          message: error.response.data.message,
        });
        break;
      case 500:
        Notification.error({
          ...notificationConfig,
          message: 'Có lỗi xảy ra',
        });
        break;
    }
    return Promise.reject(error);
  },
);

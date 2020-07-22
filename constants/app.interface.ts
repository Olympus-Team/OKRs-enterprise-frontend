import { dataType, ruleTrigger, Validator, PromiseValidtor, UserRole, Gender } from './app.type';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
  gender?: number;
  roleId?: number;
  teamId?: number;
  jobPositionId?: number;
}

export interface ProfileDTO {
  avatar: string;
  fullname: string;
  role: string;
  gender: Gender;
  email: string;
  dob: Date | '';
  department: string;
  position: string;
}

export interface SelectDTO {
  label: string;
  value: string;
}

export interface ResetPasswordDTO {
  email: string;
}

export interface ResetPasswordActionDTO {
  newPassword: string;
  token: string;
}

export interface Map<T> {
  key: string;
  name: T;
}

export interface ConfigMaps<T> extends Record<string, T> {}

export interface FormRule {
  type?: dataType;
  required?: true | false;
  message?: string;
  validator?: Validator | PromiseValidtor;
  trigger?: ruleTrigger;
  min?: number;
  max?: number;
}

/**
 * Store
 */

export interface AuthResponse {
  token: string;
}

export interface UserInfo {
  name: string;
  role?: UserRole;
  avatar?: string | null;
  gravatar?: string | null;
}

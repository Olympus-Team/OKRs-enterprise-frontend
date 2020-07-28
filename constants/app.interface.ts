import { dataType, ruleTrigger, Validator, PromiseValidtor, Gender } from './app.type';
import { EvaluationCriteriaEnum } from './app.enum';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface MailResetPassDTO {
  email: string;
}

export interface EmployeeDTO {
  id?: number;
  fullName: string;
  email: string;
  roleId: number;
  teamId: number;
  jobPositionId: number;
  isLeader: boolean;
  isActive?: boolean;
}

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  gender: boolean | null;
  teamId: number | null;
  jobPositionId: number | null;
  token: string | null;
}

export interface RegisterOption {
  lable?: string;
  value?: number;
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

export interface TeamDTO {
  name: string;
  description: string;
}

export interface JobPositionDTO {
  name: string;
  description: string;
}

export interface MeasureUnitDTP {
  preset: string;
  type: string;
  index: number;
}

export interface EvaluationCriteriorDTTO {
  content: string;
  numberOfStar: number;
  type: EvaluationCriteriaEnum;
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

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
  matchPassword: string;
}

export interface CycleDTO {
  id?: number | any;
  name?: string | any;
  startDate?: Date | string | any;
  endDate?: Date | string | any;
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
export interface ParamsUser {
  status?: number;
  text?: string;
  page?: number;
  limit?: number;
}

export interface ParamsTeam {
  page?: number;
  limit?: number;
  text?: string;
}

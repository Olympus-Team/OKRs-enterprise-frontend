export enum DispatchAction {
  LOGIN = 'auth/login',
  LOGOUT = 'auth/logout',
  CLEAR_AUTH = 'auth/clear',
  CLEAR_OKRS = 'okrs/clearOkrs',
  SET_STAFF_OKRS = 'okrs/setStaffOkrs',
  CLEAR_STAFF_OKRS = 'okrs/clearStaffOkrs',
  SET_MEASURE_UNITS = 'measureUnit/setMeasureUnits',
  CLEAR_MEASURE_UNITS = 'measureUnit/clearMeasureUnits',
}

export enum GetterState {
  USER = 'auth/user',
  TEMP_CYCLE = 'cycle/cycleTemp',
}

export enum MutationState {
  SET_USER = 'auth/setUser',
  SET_TOKEN = 'auth/setToken',
  SET_TEMP_USER = 'user/setTempUser',
  SET_USERS = 'user/setUsers',
  SET_CURRENT_CYCLE = 'cycle/setCurrentCycle',
  SET_OBJECTIVE = 'okrs/setObjective',
  SET_KRS = 'okrs/setKeyResults',
  CLEAR_KRS = 'okrs/clearKrs',
  SET_OKRS_DETAIL = 'okrs/setOkrsDetail',
  SET_TEMP_CYCLE = 'cycle/setTempCycle',
  SET_ALL_CYCLES = 'cycle/setAllCycles',
}

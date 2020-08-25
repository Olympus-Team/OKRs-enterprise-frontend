import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { ObjectiveDTO, KeyResultDTO } from '@/constants/app.interface';
import OkrsRepository from '@/repositories/OkrsRepository';

export enum OkrsMutation {
  SET_OBJECTIVE = 'setObjective',
  SET_KEY_RESULTS = 'setKeyResults',
  CLEAR_KRS = 'clearKrs',
  SET_STAFF_OKRS = 'setStaffOkrs',
}

export interface OkrsState {
  objective: ObjectiveDTO | null;
  keyResults: KeyResultDTO[] | null;
  staffOkrs: any[] | null;
}

export const state = (): OkrsState => ({
  objective: null,
  keyResults: null,
  staffOkrs: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  objective: (state) => state.objective,
  keyResults: (state) => state.keyResults,
  staffOkrs: (state) => state.staffOkrs,
};

export const mutations: MutationTree<RootState> = {
  [OkrsMutation.SET_OBJECTIVE]: (state, objective: ObjectiveDTO) => (state.objective = objective),
  [OkrsMutation.SET_KEY_RESULTS]: (state, keyResults: KeyResultDTO[]) => (state.keyResults = [...keyResults]),
  [OkrsMutation.CLEAR_KRS]: (state) => (state.keyResults = []),
  [OkrsMutation.SET_STAFF_OKRS]: (state, staffOkrs: any) => (state.staffOkrs = staffOkrs),
};

export interface OKRsAction<S, R> extends ActionTree<S, R> {
  setStaffOkrs(context: ActionContext<S, R>, payload: any): Promise<void>;
  clearStaffOkrs(context: ActionContext<S, R>, payload: any): void;
  clearOkrs(context: ActionContext<S, R>): void;
}

export const actions: OKRsAction<OkrsState, RootState> = {
  async setStaffOkrs({ commit }, { cycleId, type }): Promise<void> {
    try {
      const { data } = await OkrsRepository.getListOkrs(cycleId, type);
      commit(OkrsMutation.SET_STAFF_OKRS, Object.freeze(data.data));
    } catch (error) {}
  },
  clearStaffOkrs({ commit }) {
    commit(OkrsMutation.SET_STAFF_OKRS, []);
  },
  clearOkrs({ commit }): void {
    commit(OkrsMutation.SET_OBJECTIVE, null);
    commit(OkrsMutation.CLEAR_KRS);
  },
};

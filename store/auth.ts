import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { notifyErrorLogin } from '@/constants/app.notify';
import { LoginDTO } from '@/constants/app.interface';
import AuthRepository from '@/repositories/AuthRepository';
import { removeTokenCookie, setTokenCookie } from '@/utils/cookies';

export enum AuthMutation {
  SET_TOKEN = 'setToken',
  SET_USER = 'setUser',
}
export interface AuthState {
  token: any;
  user: any;
}

export interface AuthActions<S, R> extends ActionTree<S, R> {
  logout(): Promise<void>;
  login(context: ActionContext<S, R>, credentials: LoginDTO): Promise<any>;
  clear(context: ActionContext<S, R>): void;
}

export const state = (): AuthState => ({
  token: null,
  user: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  token: (state) => state.token,
  user: (state) => state.user,
};

export const mutations: MutationTree<RootState> = {
  [AuthMutation.SET_TOKEN]: (state, token: string) => (state.token = token),
  [AuthMutation.SET_USER]: (state, user: any) => (state.user = user),
};

export const actions: AuthActions<AuthState, RootState> = {
  async login({ commit }, { email, password }: LoginDTO) {
    try {
      const { data } = await AuthRepository.login({ email, password });
      commit(AuthMutation.SET_TOKEN, data.data.token);
      setTokenCookie(data.data.token);
      return data.data.user;
    } catch (error) {
      notifyErrorLogin(error);
      return false;
    }
  },
  async logout() {
    try {
      await AuthRepository.logout();
      removeTokenCookie();
    } catch (error) {}
  },
  clear({ commit }) {
    commit(AuthMutation.SET_TOKEN, '');
    commit(AuthMutation.SET_USER, null);
    removeTokenCookie();
  },
};

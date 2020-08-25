import { getTokenCookie } from '@/utils/cookies';
import UserRepository from '@/repositories/UserRepository';
import CycleRepository from '@/repositories/CycleRepository';
import { DispatchAction, MutationState } from '@/constants/app.vuex';

export default async function ({ redirect, store }) {
  try {
    const token = getTokenCookie();
    if (!token) {
      store.dispatch(DispatchAction.CLEAR_AUTH);
      return redirect('/dang-nhap');
    } else {
      store.commit(MutationState.SET_TOKEN, token);
      if (store.state.auth.user === null) {
        const [user, currentCycle] = await Promise.all([UserRepository.me(), CycleRepository.getCurrentCycle()]);
        store.commit(MutationState.SET_USER, user.data.data);
        store.commit(MutationState.SET_CURRENT_CYCLE, currentCycle.data.data);
        store.commit(MutationState.SET_TEMP_CYCLE, currentCycle.data.data.id);
      }
    }
  } catch (error) {
    store.dispatch(DispatchAction.CLEAR_AUTH);
    return redirect('/dang-nhap');
  }
}

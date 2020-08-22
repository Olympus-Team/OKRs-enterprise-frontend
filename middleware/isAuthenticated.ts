import { getTokenCookie } from '@/utils/cookies';
import UserRepository from '@/repositories/UserRepository';
import CycleRepository from '@/repositories/CycleRepository';
import { DispatchAction, MutationState } from '@/constants/app.enum';

export default async function ({ redirect, store }) {
  try {
    const token = getTokenCookie();
    if (!token) {
      store.dispatch(DispatchAction.CLEAR);
      return redirect('/dang-nhap');
    } else {
      store.commit(MutationState.SET_TOKEN, token);
      if (store.state.auth.user === null) {
        const [user, cycle] = await Promise.all([UserRepository.me(), CycleRepository.getCurrentCycle()]);
        store.commit(MutationState.SET_USER, user.data.data);
        store.commit(MutationState.SET_CURRENT_CYCLE, cycle.data.data);
      }
    }
  } catch (error) {
    store.dispatch(DispatchAction.CLEAR);
    return redirect('/dang-nhap');
  }
}

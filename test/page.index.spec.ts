import { mount, RouterLinkStub } from '@vue/test-utils';
import Boss from '../pages/dang-nhap/index.vue';

describe('IndexPage', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Boss, {
      stubs: {
        nuxtLink: RouterLinkStub,
      },
    });
    expect(wrapper.vm).toBeTruthy();
  });
});

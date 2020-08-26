import { NuxtConfig } from '@nuxt/types';

const nuxtConfig: NuxtConfig = {
  server: {
    port: process.env.port,
  },
  /**
   * @description Passing dynamic config and environment variables to the nuxt context
   * @docs https://nuxtjs.org/api/configuration-runtime-config#-code-publicruntimeconfig-code-
   */
  publicRuntimeConfig: {
    baseURL: process.env.baseURL,
    port: process.env.port,
    baseAPI: process.env.baseAPI,
  },
  /**
   * @description Nuxt rendering mode
   * @docs https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /**
   * @description Nuxt target
   * @docs https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /**
   * @description Headers of the page
   * @docs https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - FlameOKRs',
    title: 'Awesome tool OKRs',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Awesome tool OKRs',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,700i&display=swap&subset=vietnamese',
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['simplemde/dist/simplemde.min.css', 'highlight.js/styles/github.css', '@/assets/scss/base/_global.scss', '@/assets/css/resetCss.css'],
  /**
   * @description Plugins to load before mounting the App
   * @docs https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {
      src: '@/plugins/element-ui',
    },
    {
      src: '@/plugins/vue-fragment',
    },
    {
      src: '@/plugins/vue-filter-date',
    },
    { src: '@/plugins/vue-simplemde' },
    { src: '@/plugins/md-it' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxt/components', '@nuxtjs/dotenv', 'nuxt-clipboard2'],
  // purgeCSS: pureCssConfig,
  /**
   * @description Config all components in app
   * @docs https://github.com/nuxt/components
   */
  components: [
    '@/components',
    { path: '@/components/common', prefix: 'base' },
    { path: '@/components/account', prefix: 'account' },
    { path: '@/components/profile', prefix: 'profile' },
    { path: '@/components/okrs', prefix: '' },
    { path: '@/components/okrs/steps', prefix: 'step' },
    { path: '@/components/manage', prefix: '' },
    { path: '@/components/admin', prefix: '' },
    { path: '@/components/cfrs', prefix: 'cfrs' },
    { path: '@/components/dashboard', prefix: 'dashboard' },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/markdownit', '@nuxtjs/axios', '@nuxtjs/pwa'],
  /**
   * @description Axios module configuration
   * @docs https://axios.nuxtjs.org/options
   */
  axios: {},
  /**
   * @description Build configuration
   * @docs https://nuxtjs.org/api/configuration-build/
   */
  // router: {
  //   prefetchLinks: false,
  // },
  build: {
    // analyze: true,
    extractCSS: {
      ignoreOrder: true,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    // fixed netlify deploy
    // https://github.com/nuxt/nuxt.js/issues/5800#issuecomment-597009572
    html: {
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    },
    babel: {
      presets() {
        return [['@nuxt/babel-preset-app', { loose: true }]];
      },
    },
    extend({ module }: any, { isDev, isClient }: any): any {
      if (module !== undefined) {
        const svgRule = module.rules.find((rule) => rule.test.test('.svg'));
        svgRule.test = /\.(png|jpe?g|gif|webp)$/;

        module.rules.push({
          test: /\.svg$/,
          use: ['babel-loader', 'vue-svg-loader'],
        });
      }
      if (isDev && isClient && module) {
        // Enabling eslint:
        module.rules.push({
          enforce: 'pre',
          test: /\.(js|ts|vue)$/u,
          loader: 'eslint-loader',
          exclude: /(node_modules)/u,
        });
      }
    },
  },
};

export default nuxtConfig;

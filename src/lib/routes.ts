export const routes = {
  home: '/',
  account: {
    authQueryKey: 'auth',
    login: { path: '/account', query: { key: 'auth', value: 'login' } },
    signup: { path: '/account', query: { key: 'auth', value: 'signup' } },
    forgetPassword: { path: '/account', query: { key: 'auth', value: 'forget-password' } },
    inputOTP: { path: '/account', query: { key: 'auth', value: 'input-otp' } },
    resetPassword: { path: '/account', query: { key: 'auth', value: 'reset-password' } },
  },
};

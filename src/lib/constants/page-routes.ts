export const routes = {
  home: '/',
  error: '/error',
  dashboard: {
    path: '/dashboard',
    keys: {
      token: 'token',
    },
  },
  account: {
    path: '/account',
    keys: {
      auth: 'auth',
      mail: 'email',
      token: 'token',
      error: 'error',
    },
    query: {
      login: 'login',
      signup: 'signup',
      forgetPassword: 'forget-password',
      inputOTP: 'input-otp',
      resetPassword: 'reset-password',
    },
  },
};

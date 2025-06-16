import { SEVENDAYS, LAX } from '../constants';
import { routes } from '../constants/page-routes';

export const cookieOptionsAuth = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: LAX,
  expires: SEVENDAYS,
  path: routes.home,
};

export const cookieOptionsUnAuth = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: LAX,
  path: routes.home,
  maxAge: 0,
};

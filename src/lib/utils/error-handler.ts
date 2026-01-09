import axios, { isAxiosError } from 'axios';
import { toastFunc } from './toasts';
import { AUTH_FAILED, UNEXPECTED_ERROR } from '../constants/messages';
import { NextResponse } from 'next/server';

export const toastErrorHandler = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    toastFunc(error.response.data.message, false);
  } else {
    toastFunc(UNEXPECTED_ERROR, false);
  }
};

export const routeErrorHandler = (err: unknown) => {
  if (isAxiosError(err) && err.response) {
    return NextResponse.json(
      {
        message: err.response.data?.message || AUTH_FAILED,
      },
      { status: err.response.status }
    );
  }
  return NextResponse.json(
    {
      message: AUTH_FAILED,
    },
    { status: 500 }
  );
};

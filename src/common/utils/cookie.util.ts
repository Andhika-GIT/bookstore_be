// src/utils/cookie.util.ts

import { Response } from 'express';

export const setCookie = (
  response: Response,
  name: string,
  value: string,
  options: any = {},
) => {
  const defaultOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 5 * 24 * 60 * 60 * 1000,
    ...options,
  };
  response.cookie(name, value, defaultOptions);
};

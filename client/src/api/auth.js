import { useFetch } from 'use-http';
import config from '../config';

import axios from 'axios';

// We could send request with useFetch
export function useLogout(accessToken, headers) {
  return useFetch(`${config.api_host}/api/auth/logout`, {
    headers: {
      authorization: 'Bearer ' + accessToken,
      ...headers,
    },
  });
}

// We could also send request with axios

// allow sending cookies
axios.defaults.withCredentials = true;

export async function onSignup(signupData, configurationObj) {
  return await axios.post(
    `${config.api_host}/api/auth/register`,
    signupData,
    configurationObj
  );
}

export async function onLogin(loginData) {
  return await axios.post(
    `${config.api_host}/api/auth/login`,
    JSON.stringify(loginData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function fetchProtectedInfo() {
  return await axios.get(`${config.api_host}/api/auth/protected`);
}

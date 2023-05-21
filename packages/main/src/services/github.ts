import { githubToken } from '../const';

export const githubFetch = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      ...(githubToken && { Authorization: 'Bearer ' + githubToken }),
    },
  });
  if (!res.ok) {
    throw new Error(`fetch ${url} failed`);
  }
  return res;
};

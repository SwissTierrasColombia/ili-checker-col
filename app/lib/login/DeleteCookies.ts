'use server';

import { cookies } from 'next/headers';

export default async function DeleteCookies() {
  const token = cookies().get('access_token');
  if (token) {
    cookies().delete('access_token');
  }
  return true;
}

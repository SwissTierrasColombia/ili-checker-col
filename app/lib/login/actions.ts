'use server';

import { BASE_URL, PATH_INFO_USER, PATH_TOKEN } from '@/app/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import DeleteCookies from '@/app/lib/login/DeleteCookies';

export async function login(formData: { username: string; password: string }) {
  try {
    const response = await fetch(`${BASE_URL}${PATH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${formData.username}&password=${formData.password}`,
    });

    const data = await response.json();

    if (response.status === 401) {
      return { status: response.status, message: data?.detail };
    }

    if (response.status === 200) {
      cookies().set('access_token', data?.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return { status: 200, message: 'Login successful' };
    }
  } catch (error) {
    console.log(error);
    return {
      message: `Error al conectar con el servidor: ${(error as Error).message}`,
    };
  }
}

export async function logout() {
  const sessionClosed = await DeleteCookies();
  if (!sessionClosed) {
    throw new Error('Error al cerrar sesión');
  }

  revalidatePath('/');
  return { message: 'Cierre de sesión exitosa' };
}

export async function getSession() {
  const token = cookies().get('access_token')?.value;

  if (!token) return null;

  try {
    const response = await fetch(`${BASE_URL}${PATH_INFO_USER}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token ?? ''}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

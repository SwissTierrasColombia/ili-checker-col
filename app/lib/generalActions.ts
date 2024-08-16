'use server';

import { cookies } from 'next/headers';
import DeleteCookies from '@/app/lib/login/DeleteCookies';
import { BASE_URL, PATH_UPLOAD_FILE, PATH_USER_IS_ADMIN } from '@/app/config';
import { redirect } from 'next/navigation';
import fetch from 'node-fetch';
import { ResponseNodeFetch } from '@/app/types/types';

export async function UploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  const token = cookies().get('access_token')?.value;

  if (!file) {
    throw new Error('No file found');
  }

  if (file.size >= 1024 * 1024 * 300) {
    return { message: 'File size exceeds 300MB' };
  }

  try {
    let totalUpload = 0;
    const totalSize = file.size;
    const chunkSize = 16 * 1024 * 1024;
    let data: ResponseNodeFetch = { message: '' };

    while (totalUpload < totalSize) {
      const start = totalUpload;
      const end = Math.min(start + chunkSize, totalSize);
      const chunk = file.slice(start, end);

      const contentData = new FormData();
      contentData.append(
        'file',
        new File([chunk], file.name, { type: file.type }),
      );

      totalUpload += chunk.size;

      const response = await fetch(`${BASE_URL}${PATH_UPLOAD_FILE}`, {
        method: 'POST',
        body: contentData,
        headers: {
          'X-File-Size': totalSize.toString(),
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response.status !== 202) {
        data = (await response.json()) as ResponseNodeFetch;
        break; // Si falla la carga, salir del bucle.
      }
    }
    return data;
  } catch (error) {
    console.error(error);
    return { message: 'Failed to upload file: ' + error };
  }
}

export async function userIsAdmin() {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  try {
    const response = await fetch(`${BASE_URL}${PATH_USER_IS_ADMIN}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await DeleteCookies();
      }
      return {
        error: `Error al validar si el usuario es administrador. ${response.statusText}`,
      };
    } else {
      return {
        error: null,
        data: (await response.json()) as { Admin: boolean },
      };
    }
  } catch (error) {
    return {
      error: `Error al conectar con el servidor: ${(error as Error).message}`,
    };
  }
}

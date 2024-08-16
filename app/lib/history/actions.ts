'use server';

import { BASE_URL, PATH_TASKS, PATH_GET_TASK_FOR_USER } from '@/app/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function deleteTask(taskId: string | number) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_TASKS}${taskId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return {
      message: `Error al eliminar la tarea.`,
      error: `${response.statusText}`,
    };
  } else {
    return { message: 'Tarea eliminada satisfactoriamente' };
  }
}

export async function getTaskForUser() {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  try {
    const response = await fetch(`${BASE_URL}${PATH_GET_TASK_FOR_USER}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { error: `Error al obtener las tareas. ${response.statusText}` };
    } else {
      return { error: null, data: await response.json() };
    }
  } catch (error) {
    return {
      error: `Error al conectar con el servidor: ${(error as Error).message}`,
    };
  }
}

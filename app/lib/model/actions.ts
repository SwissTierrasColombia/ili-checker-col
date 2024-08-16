'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { BASE_URL, PATH_MODELS } from '@/app/config';
import { Models } from '@/app/types/types';

export async function getModelsForUser() {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_MODELS}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      redirect('/dashboard');
    }
    throw new Error(`Error en obtener los datos, ${response.statusText}`);
  } else {
    return await response.json();
  }
}

export async function createModel(formData: Models) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_MODELS}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    return {
      message: `Error al crear modelo. `,
      error: `${response.statusText}`,
    };
  } else {
    revalidatePath('/dashboard/models');
    return { message: 'Modelo creado satisfactoriamente' };
  }
}

export async function deleteModel(id: number) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_MODELS}${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      message: `Error al eliminar el modelo. `,
      error: `${response.statusText}`,
    };
  } else {
    revalidatePath('/dashboard/models');
    return { message: `Modelo eliminado satisfactoriamente` };
  }
}

export async function getModelForId(id: string | number) {
  const response = await fetch(`${BASE_URL}${PATH_MODELS}${id}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      redirect('/dashboard');
    }
    throw new Error(
      `Error al obtener los modelos por id. ${response.statusText}`,
    );
  } else {
    return await response.json();
  }
}

export async function editModel(formData: Models) {
  const id = formData.id;
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_MODELS}${id}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    return {
      message: `Error al editar el modelo. `,
      error: `${response.statusText}`,
    };
  } else {
    revalidatePath('/dashboard/models');
    return { message: `Modelo editado satisfactoriamente` };
  }
}

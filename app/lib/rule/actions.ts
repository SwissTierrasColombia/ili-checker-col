'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BASE_URL, PATH_GET_RULES_FOR_MODEL, PATH_RULES } from '@/app/config';
import { Rules } from '@/app/types/types';

export async function getRulesForModel(id: number | string) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(
    `${BASE_URL}${PATH_GET_RULES_FOR_MODEL}`.replace('<pk>', id.toString()),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    if (response.status === 403) {
      redirect('/dashboard');
    }
    throw new Error(
      `Error al obtener las reglas por modelo. ${response.statusText}`,
    );
  } else {
    return await response.json();
  }
}

export async function createRules(formData: Rules) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }
  const response = await fetch(`${BASE_URL}${PATH_RULES}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    return {
      message: `Error al crear la regla. `,
      error: `${response.statusText}`,
    };
  } else {
    revalidatePath('/dashboard/rules');
    return { message: `Regla creada satisfactoriamente` };
  }
}

export async function deleteRule(id: number) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_RULES}${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      message: `Error al eliminar la regla. `,
      error: `${response.statusText}`,
    };
  } else {
    revalidatePath('/dashboard/rules');
    return { message: `Regla eliminada satisfactoriamente` };
  }
}

export async function getRuleForId(id: string | number) {
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_RULES}${id}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error al obtener las reglas por id. ${response.statusText}`,
    );
  } else {
    return await response.json();
  }
}

export async function editRule(formData: Rules) {
  const id = formData.id;
  const token = cookies().get('access_token')?.value;
  if (!token) {
    redirect('/');
  }

  const response = await fetch(`${BASE_URL}${PATH_RULES}${id}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    return {
      message: `Error al editar la regla. `,
      error: `${response.statusText}`,
    };
  } else {
    revalidatePath('/dashboard/rules');
    return { message: `Regla editada satisfactoriamente` };
  }
}

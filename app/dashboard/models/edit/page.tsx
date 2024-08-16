'use client';

import { useSelectedModelStore } from '@/app/context/store';
import { editModel, getModelForId } from '@/app/lib/model/actions';
import { ContentResponse, Models } from '@/app/types/types';
import Typography from '@mui/material/Typography';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Card, CardContent, TextField, Button } from '@mui/material';
import { toast } from 'sonner';

export default function EditModelPage() {
  const id = useSelectedModelStore((state) => state.model?.id);
  const [data, setData] = useState<Models>();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<Models>();

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/models');
      return;
    }

    async function getData() {
      const newData = await getModelForId(id!);
      setData(newData);
    }
    getData();
  }, [id]);

  const formAction: () => void = handleSubmit(async (data) => {
    const res: ContentResponse = await editModel(data);
    if (res.error) {
      toast.error(`${res.message}${res.error}`);
    } else {
      toast.success(`${res.message}`);
      redirect('/dashboard/models');
    }
  });

  return (
    <React.Fragment>
      <Typography
        variant="h4"
        component={'h1'}
        color="inherit"
        sx={{
          textAlign: 'center',
        }}
      >
        Editar modelo
      </Typography>
      <Box
        component={'section'}
        sx={{
          maxWidth: {
            xs: '100%',
            md: '40%',
          },
          placeContent: 'center',
          minHeight: '70vh',
          mx: 'auto',
        }}
      >
        {data && (
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Box component={'form'} autoComplete="on" action={formAction}>
                <Controller
                  name="id"
                  control={control}
                  defaultValue={data.id}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <TextField
                        autoFocus={true}
                        variant="standard"
                        sx={{ mt: 2.5, display: 'none' }}
                        size="small"
                        error={!!error}
                        label="id"
                        type="text"
                        value={field.value}
                        InputProps={{
                          readOnly: false,
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        fullWidth
                      />
                      {error?.type === 'required' && (
                        <Typography
                          variant="caption"
                          component={'p'}
                          color="error"
                          sx={{
                            textAlign: 'left',
                          }}
                        >
                          Campo obligatorio
                        </Typography>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="nombre"
                  control={control}
                  defaultValue={data.nombre}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <TextField
                        autoFocus={true}
                        variant="standard"
                        sx={{ mt: 2.5 }}
                        size="small"
                        error={!!error}
                        label="Nombre"
                        type="text"
                        value={field.value}
                        InputProps={{
                          readOnly: false,
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        fullWidth
                      />
                      {error?.type === 'required' && (
                        <Typography
                          variant="caption"
                          component={'p'}
                          color="error"
                          sx={{
                            textAlign: 'left',
                          }}
                        >
                          Campo obligatorio
                        </Typography>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="descripcion"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={data.descripcion}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <TextField
                        autoFocus={false}
                        variant="standard"
                        sx={{ mt: 2.5 }}
                        size="small"
                        error={!!error}
                        label="Descripción"
                        type="text"
                        value={field.value}
                        InputProps={{
                          readOnly: false,
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        fullWidth
                      />
                      {error?.type === 'required' && (
                        <Typography
                          variant="caption"
                          component={'p'}
                          color="error"
                          sx={{
                            textAlign: 'left',
                          }}
                        >
                          Campo obligatorio
                        </Typography>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="iliname"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={data.iliname}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <TextField
                        autoFocus={false}
                        variant="standard"
                        sx={{ mt: 2.5 }}
                        size="small"
                        error={!!error}
                        label="Iliname"
                        type="text"
                        value={field.value}
                        InputProps={{
                          readOnly: false,
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        fullWidth
                      />
                      {error?.type === 'required' && (
                        <Typography
                          variant="caption"
                          component={'p'}
                          color="error"
                          sx={{
                            textAlign: 'left',
                          }}
                        >
                          Campo obligatorio
                        </Typography>
                      )}
                    </>
                  )}
                />
                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 2.5,
                    width: '100%',
                  }}
                >
                  Guardar
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  type="button"
                  color="error"
                  sx={{
                    mt: 1.5,
                    width: '100%',
                  }}
                  onClick={() => router.back()}
                >
                  Volver
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </React.Fragment>
  );
}

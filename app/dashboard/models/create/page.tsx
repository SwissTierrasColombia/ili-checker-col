'use client';

import { useForm, Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import { Models } from '@/app/types/types';
import { createModel } from '@/app/lib/model/actions';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateModelPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<Models>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      iliname: '',
    },
  });

  const formAction: () => void = handleSubmit(async (data) => {
    const res = await createModel(data);
    if (res.error) {
      toast.error(`${res.message}${res.error}`);
    } else {
      toast.success(res.message);
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
        Crear modelo
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
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Box component={'form'} autoComplete="on" action={formAction}>
              <Controller
                name="nombre"
                control={control}
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
                Crear
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
      </Box>
    </React.Fragment>
  );
}

'use client';

import { useForm, Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState } from 'react';
import { ContentResponse, Rules } from '@/app/types/types';
import { createRules } from '@/app/lib/rule/actions';
import { redirect, useRouter } from 'next/navigation';
import { useSelectedModelStore } from '@/app/context/store';
import EditorMonaco from '@/app/components/EditorMonaco';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useMediaQuery } from '@mui/material';
import { toast } from 'sonner';

type ThemeEditor = 'light' | 'vs-dark';

export default function CreateRulePage() {
  const prefersColorLight = useMediaQuery('(prefers-color-scheme: light)');
  const router = useRouter();
  const id = useSelectedModelStore((state) => state.model?.id);
  const [themeEditor, setThemeEditor] = useState<ThemeEditor>(
    prefersColorLight ? 'light' : 'vs-dark',
  );
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<Rules>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      modelo: Number(id),
    },
  });

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/models');
      return;
    }
  }, [id]);

  const formAction: () => void = handleSubmit(async (data) => {
    const res: ContentResponse = await createRules(data);
    if (res.error) {
      toast.error(`${res.message}${res.error}`);
    } else {
      toast.success(res.message);
      redirect('/dashboard/rules');
    }
  });

  const handleClickThemeEditor = () => {
    themeEditor === 'light'
      ? setThemeEditor('vs-dark')
      : setThemeEditor('light');
  };

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
        Crear regla
      </Typography>

      <Box
        component={'section'}
        sx={{
          maxWidth: {
            xs: '100%',
            md: '40%',
          },
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
                      sx={{ my: 2.5 }}
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
                name="query"
                control={control}
                rules={{ required: true, minLength: 1 }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Box component={'label'}>Query</Box>
                    <Box
                      component={'section'}
                      sx={{
                        border: '1px solid #ccc',
                        boxShadow: '0px 0px 5px #ccc',
                        borderRadius: '5px',
                        p: 1,
                        width: '100%',
                      }}
                    >
                      <div>
                        <Box
                          component={'div'}
                          sx={{
                            textAlign: 'right',
                          }}
                        >
                          <IconButton
                            aria-label="Cambio tema"
                            sx={{
                              textAlign: 'right',
                            }}
                            onClick={handleClickThemeEditor}
                          >
                            {themeEditor === 'vs-dark' ? (
                              <DarkModeIcon />
                            ) : (
                              <LightModeIcon />
                            )}
                          </IconButton>
                        </Box>
                        <EditorMonaco
                          defaultValue=""
                          onchange={field.onChange}
                          value={field.value}
                          selectTheme={themeEditor}
                        />
                      </div>
                    </Box>
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
                name="modelo"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextField
                      autoFocus={false}
                      variant="standard"
                      sx={{ mt: 2.5, display: 'none' }}
                      size="small"
                      error={!!error}
                      label="Modelo"
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

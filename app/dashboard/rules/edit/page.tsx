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
import { editRule, getRuleForId } from '@/app/lib/rule/actions';
import { redirect, useRouter } from 'next/navigation';
import { useSelectedRuleStore } from '@/app/context/store';
import EditorMonaco from '@/app/components/EditorMonaco';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useMediaQuery } from '@mui/material';
import { toast } from 'sonner';

type ThemeEditor = 'light' | 'vs-dark';

export default function EditRulePage() {
  const prefersColorLight = useMediaQuery('(prefers-color-scheme: light)');
  const router = useRouter();
  const id = useSelectedRuleStore((state) => state.id);
  const [data, setData] = useState<Rules>();
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<Rules>();
  const [themeEditor, setThemeEditor] = useState<ThemeEditor>(
    prefersColorLight ? 'light' : 'vs-dark',
  );

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/rules');
      return;
    }

    async function getData() {
      const data = await getRuleForId(id);
      setData(data);
    }
    getData();
  }, [id]);

  const formAction: () => void = handleSubmit(async (data) => {
    const res: ContentResponse = await editRule(data);
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
        Editar regla
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
        {data && (
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Box component={'form'} autoComplete="on" action={formAction}>
                <Controller
                  name="id"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={data.id}
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
                  rules={{ required: true }}
                  defaultValue={data.nombre}
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
                  defaultValue={data.query}
                  render={({ field, fieldState: { error } }) => (
                    <>
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
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box component={'label'}>Query</Box>
                            <IconButton
                              aria-label="delete"
                              sx={{
                                textAlign: 'right',
                              }}
                              onClick={handleClickThemeEditor}
                            >
                              {themeEditor === 'vs-dark' ? (
                                <LightModeIcon />
                              ) : (
                                <DarkModeIcon />
                              )}
                            </IconButton>
                          </Box>
                          <EditorMonaco
                            defaultValue={data.query}
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
                  defaultValue={data.modelo}
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

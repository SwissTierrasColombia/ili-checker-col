'use client';

import * as React from 'react';
import { Email, Visibility, VisibilityOff, VpnKey } from '@mui/icons-material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../lib/login/actions';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface User {
  username: string;
  password: string;
}

interface Props {
  closeDrawer: () => void;
}

export const Login = ({ closeDrawer }: Props) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isNotValidUser, setIsNotValidUser] = React.useState(false);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<User>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [showPass, setShowPass] = React.useState(false);

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const formAction: () => void = handleSubmit(async (data) => {
    if (errorMessage !== '') {
      setErrorMessage('');
    }

    if (isNotValidUser) {
      setIsNotValidUser(false);
    }

    const response = await login(data);

    if (response?.status === 401) {
      setIsNotValidUser(true);
      return;
    }

    if (response?.status === 200) {
      closeDrawer();
      toast.success('Bienvenido');
      router.push('/dashboard');
      return;
    }

    if (response?.message) {
      setErrorMessage(response?.message ?? '');
    }
  });

  return (
    <React.Fragment>
      <Typography
        variant="h4"
        color="inherit"
        sx={{
          textAlign: 'center',
        }}
      >
        Inicia sesión
      </Typography>
      <Box
        component={'form'}
        autoComplete="on"
        action={formAction}
        sx={{
          width: {
            sm: 500,
          },
        }}
      >
        <React.Fragment>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField
                  autoFocus={true}
                  variant="standard"
                  sx={{ mt: 2.5 }}
                  size="small"
                  error={!!error}
                  label="Usuario"
                  type="text"
                  value={field.value}
                  InputProps={{
                    readOnly: false,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
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
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField
                  variant="standard"
                  sx={{ mt: 2.5 }}
                  size="small"
                  error={!!error}
                  label="Contraseña"
                  type={showPass ? 'text' : 'password'}
                  value={field.value}
                  InputProps={{
                    readOnly: false,
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPass}
                          edge="end"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
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
        </React.Fragment>
        {isNotValidUser && (
          <Typography
            variant="body1"
            component={'p'}
            color="error"
            sx={{
              textAlign: 'center',
              paddingY: 2,
            }}
          >
            Usuario o contraseña incorrecta
          </Typography>
        )}
        {errorMessage && (
          <Typography
            variant="body1"
            component={'p'}
            color="error"
            sx={{
              textAlign: 'center',
              paddingY: 2,
            }}
          >
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          size="small"
          color="primary"
          type="submit"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 2.5,
          }}
        >
          Ingresar
        </Button>
      </Box>
      <Typography
        variant="body1"
        component={'p'}
        color="inherit"
        sx={{
          textAlign: 'center',
          paddingTop: 3,
        }}
      >
        ¿No tienes una cuenta?{' '}
        <Link href={'#'} className="text-[#2196f3]">
          Registrate
        </Link>
      </Typography>
    </React.Fragment>
  );
};

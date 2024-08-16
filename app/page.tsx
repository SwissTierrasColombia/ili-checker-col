import * as React from 'react';
import ButtonAppBar from './components/Navbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MyDropzone from './components/Dropzone';
import { getSession } from './lib/login/actions';
import { redirect } from 'next/navigation';
import Footer from './components/Footer';

export default async function Home() {
  const user = await getSession();
  if (user != null) {
    redirect('/dashboard');
  }

  return (
    <Box component={'section'}>
      <ButtonAppBar user={user} />
      <Box
        component={'main'}
        sx={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mt: {
            md: 2,
            lg: 1,
          },
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 'medium',
            fontSize: {
              md: '3rem',
              lg: '3.2rem',
            },
          }}
        >
          Validar archivo XTF
        </Typography>
        <MyDropzone />
        <Footer />
      </Box>
    </Box>
  );
}

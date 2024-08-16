import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import MyDropzone from '../components/Dropzone';
import Footer from '../components/Footer';

export default async function Dashboard() {
  return (
    <Box
      component={'section'}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant={'h4'}
        component={'h1'}
        sx={{
          textAlign: 'center',
          marginY: 2,
        }}
      >
        Validación XTF
      </Typography>
      <MyDropzone />
      <Footer />
    </Box>
  );
}

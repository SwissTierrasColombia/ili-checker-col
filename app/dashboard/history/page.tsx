import TableComponent from '@/app/components/Table';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function History() {
  return (
    <Box component={'section'}>
      <Typography
        variant="h4"
        component={'h1'}
        color="inherit"
        sx={{
          textAlign: 'center',
        }}
      >
        Historial
      </Typography>
      <TableComponent />
    </Box>
  );
}

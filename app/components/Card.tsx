import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

interface DataProps {
  pdf?: string;
  log: string;
}

interface Props {
  message: string;
  data: DataProps | null;
}

export default function BasicCard({ message, data }: Props) {
  return (
    <Card
      sx={{
        width: {
          sx: 275,
          md: 400,
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image="/validador/process_file.svg"
        alt="process file"
      />
      <CardContent
        sx={{
          padding: 0,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            textAlign: 'center',
            marginY: 1,
          }}
        >
          {data ? 'Archivo procesado' : 'Subiendo y procesando el archivo...'}
        </Typography>
        <Box
          component={'div'}
          sx={{
            padding: 2,
          }}
        >
          {message !== 'File upload successfully' && (
            <Typography
              component={'p'}
              sx={{
                color: 'red',
                textAlign: 'center',
              }}
            >
              {message}
            </Typography>
          )}
          {data && (
            <Box
              component={'div'}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              {data.pdf && (
                <a href={data.pdf} download={''}>
                  <Button variant="outlined" color="primary">
                    Descargar PDF
                  </Button>
                </a>
              )}
              {data.log && (
                <a href={data.log} download={''}>
                  <Button variant="outlined" color="success">
                    Descargar LOG
                  </Button>
                </a>
              )}
            </Box>
          )}
          {!message && (
            <Box
              component={'div'}
              sx={{
                marginX: 'auto',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Por favor espere...
              </Typography>
              <Skeleton width={'75%'} animation={'wave'} />
              <Skeleton width={'85%'} />
              <Skeleton animation={'wave'} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

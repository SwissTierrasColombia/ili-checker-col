'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import { UploadFile } from '../lib/generalActions';
import { Box, Zoom } from '@mui/material';
import BasicCard from './Card';
import ResponsiveDialog from './ResponsiveDialog';
import { userIsAdmin } from '../lib/generalActions';
import { toast } from 'sonner';
import { UrlsProps } from '@/app/types/types';

export default function MyDropzone() {
  const [message, setMessage] = React.useState('');
  const [isAFileUploaded, setIsAFileUploaded] = React.useState<boolean>(false);
  const [showResponsiveDialog, setShowResponsiveDialog] =
    React.useState<boolean>(false);
  const [data, setData] = React.useState<UrlsProps | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<null | boolean>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const extension: string[] = acceptedFiles[0]?.name.split('.');

    if (!extension?.includes('xtf') && !extension?.includes('zip')) {
      setShowResponsiveDialog(true);
      return;
    }

    setIsAFileUploaded(true);
    const formdata = new FormData();
    formdata.append('file', acceptedFiles[0]);
    const res = await UploadFile(formdata);
    setMessage(res?.message ?? res?.detail);
    if (res?.urls) {
      setData(res.urls);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/octet-stream': ['.xtf'],
    },
  });

  React.useEffect(() => {
    async function getUser() {
      const res = await userIsAdmin();
      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.data?.Admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

    if (isAdmin == null) {
      getUser();
    }
  }, [isAdmin]);

  const handleClickUploadFile = () => {
    setMessage('');
    setIsAFileUploaded(false);
    setData(null);
  };

  return (
    <React.Fragment>
      {isAFileUploaded ? (
        <Zoom in={true}>
          <Box
            component={'section'}
            sx={{
              height: '75vh',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              overflowY: 'auto',
            }}
          >
            <BasicCard message={message} data={data} />
            {isAdmin && (
              <Button
                color="primary"
                variant="contained"
                sx={{
                  marginTop: 2,
                  paddingX: '2rem',
                  paddingY: '0.5rem',
                }}
                onClick={handleClickUploadFile}
              >
                Subir otro archivo
              </Button>
            )}

            {!isAdmin && data && (
              <Button
                color="primary"
                variant="contained"
                sx={{
                  marginTop: 2,
                  paddingX: '2rem',
                  paddingY: '0.5rem',
                }}
                onClick={handleClickUploadFile}
              >
                Subir otro archivo
              </Button>
            )}
          </Box>
        </Zoom>
      ) : (
        <div
          {...getRootProps()}
          className="p-3 bg-sky-700 hover:bg-sky-600 rounded-lg w-11/12 md:w-2/3 h-[65vh] shadow-xl"
        >
          <div className="border-2 border-dashed w-full h-full flex flex-col justify-center items-center">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <div className="text-center">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    background: 'white',
                    color: 'black',
                    paddingX: '2.5rem',
                    paddingY: '1rem',
                    ':hover': {
                      background: 'white',
                      color: 'black',
                    },
                  }}
                >
                  ELEGIR ARCHIVO
                </Button>
                <Typography
                  variant="h6"
                  component={'p'}
                  color="white"
                  sx={{
                    fontSize: {
                      md: '1.5rem',
                    },
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  ó arrastra tu archivo y sueltalo aquí
                </Typography>
                <Typography variant="body2" component={'p'} color={'white'}>
                  (.xtf - .zip)
                </Typography>
              </div>
            )}
          </div>
        </div>
      )}
      {showResponsiveDialog && (
        <ResponsiveDialog
          activeDialog={showResponsiveDialog}
          title="Error"
          content="El tipo de formato no es valido, valide e intente nuevamente!."
          handleCloseDialog={() => setShowResponsiveDialog(false)}
        />
      )}
    </React.Fragment>
  );
}

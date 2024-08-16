'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useStore } from '../context/store';

interface Props {
  title: string;
  content: string;
  activeDialog: boolean;
  handleCloseDialog: () => void;
}

export default function ResponsiveDialog({
  title,
  content,
  activeDialog,
  handleCloseDialog,
}: Props) {
  const { setNameFile } = useStore();
  const [open, setOpen] = React.useState(activeDialog);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseDialog();
    setNameFile('');
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{
          display: 'none',
        }}
        onClick={handleClickOpen}
      >
        Open responsive dialog
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="info"
            className="bg-[#1976d2]"
            onClick={handleClose}
            autoFocus
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

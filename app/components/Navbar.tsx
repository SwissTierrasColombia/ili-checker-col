'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';

import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { deepOrange } from '@mui/material/colors';
import { Login } from '@/app/components/Login';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/lib/login/actions';
import { useTheme } from '@mui/material/styles';

interface UserProps {
  id: number;
  username: string;
}

interface Props {
  user: UserProps;
}

const widthDrawer = {
  xs: 430,
  sm: 600,
  md: 800,
  lg: 1650,
};

const settings = ['Dashboard', 'Logout'];

export default function ButtonAppBar({ user }: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const handleClickMenu = (option: string) => {
    if (option === 'Logout') {
      logout();
      return;
    }

    if (option === 'Dashboard') {
      router.push('/dashboard');
      return;
    }

    handleCloseUserMenu();
  };

  const DrawerList = (
    <Box
      sx={{
        width: {
          xs: widthDrawer.xs,
          sm: widthDrawer.sm,
          md: widthDrawer.md,
          lg: widthDrawer.lg,
        },
      }}
      role="presentation"
    >
      <Box
        component={'div'}
        role="presentation"
        sx={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <IconButton aria-label="close" onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack
        direction={'column'}
        spacing={4}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          marginX: '1rem',
          height: 700,
        }}
      >
        <Login closeDrawer={handleCloseDrawer} />
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? 'white' : '',
        }}
      >
        <Toolbar>
          <CardMedia
            onClick={() => router.push('/')}
            component="img"
            sx={{ width: 151, height: 'auto' }}
            image="/validador/logo_swisstierras.png"
            alt="Logo Ceicol"
          />
          {user != null ? (
            <Box
              component={'div'}
              sx={{
                marginLeft: 'auto',
              }}
            >
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                  <Avatar
                    sx={{ bgcolor: deepOrange[500] }}
                    alt={user?.username?.toUpperCase()}
                  >
                    {user.username.substring(0, 2).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleClickMenu(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="info"
              sx={{ marginLeft: 'auto' }}
              onClick={toggleDrawer(true)}
            >
              Iniciar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Menu de inicio de sesión */}
      <Box component={'section'}>
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </Box>
    </Box>
  );
}

'use client';

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { deepOrange } from '@mui/material/colors';
import { userIsAdmin } from '../lib/generalActions';
import { logout } from '../lib/login/actions';
import HistoryIcon from '@mui/icons-material/History';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import { useRouter } from 'next/navigation';
import Fade from '@mui/material/Fade';
import { toast } from 'sonner';
import { ContentResponse } from '@/app/types/types';
import { ColorModeContext } from '../context/Theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface UserProps {
  id: number;
  username: string;
}

interface Props {
  children: React.ReactNode;
  user: UserProps;
}

const drawerWidth = 240;

const settings = ['Logout'];
const fields = [
  {
    title: 'Validar',
    icon: <LibraryAddCheckIcon />,
    path: '/dashboard',
  },
  {
    title: 'Historial',
    icon: <HistoryIcon />,
    path: '/dashboard/history',
  },
] as const;

const subFields = [
  {
    title: 'Modelos',
    icon: <CoPresentIcon />,
    path: '/dashboard/models',
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.down('sm')]: {
    width: `calc(${theme.spacing(0)} + 1px)`,
  },
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  backgroundColor: 'black',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function ToogleColorMode() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
      }}
    >
      <Tooltip
        title={theme.palette.mode === 'light' ? 'Modo oscuro' : 'Modo claro'}
      >
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === 'dark' ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function MiniDrawer({ user, children }: Props) {
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseSession = async () => {
    const res: ContentResponse = await logout();
    if (res?.message) {
      toast.info(res.message);
      router.push('/');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          boxShadow: '0px 0px 10px #00000029',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginLeft: 'auto',
            }}
          >
            <ToogleColorMode />
            {user != null && (
              <Box component={'div'}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                    <Avatar
                      sx={{ bgcolor: deepOrange[500] }}
                      alt={user?.username.toUpperCase()}
                    >
                      {user?.username.substring(0, 2)?.toUpperCase()}
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
                      onClick={
                        setting === 'Logout'
                          ? handleCloseSession
                          : handleCloseUserMenu
                      }
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {fields.map((field) => (
            <ListItem
              key={field.title}
              disablePadding
              sx={{ display: 'block' }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => router.push(field.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip
                    title={field.title}
                    placement="right"
                    arrow
                    TransitionComponent={Fade}
                  >
                    {field.icon}
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary={field.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {isAdmin && (
          <List>
            {subFields.map((field) => (
              <ListItem
                key={field.title}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => router.push(field.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Tooltip
                      title={field.title}
                      placement="right"
                      arrow
                      TransitionComponent={Fade}
                    >
                      {field.icon}
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary={field.title}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

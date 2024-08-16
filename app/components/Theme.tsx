'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { type ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from '../context/Theme';

export const ThemePrefers = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

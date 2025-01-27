import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemePrefers } from './components/Theme';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Check XTF - Ceicol',
    template: '%s | Check XTF - Ceicol', // %s es el título de la página, se usa para mostrar el título de la página en el navegador y en el título de la página.
  },
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemePrefers>{children}</ThemePrefers>
        </AppRouterCacheProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}

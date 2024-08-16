import Box from '@mui/material/Box';
import { Metadata } from 'next';
import MiniDrawer from '../components/Drawer';
import { getSession } from '../lib/login/actions';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  return (
    <Box component={'section'} sx={{}}>
      <MiniDrawer user={user}>{children}</MiniDrawer>
    </Box>
  );
}

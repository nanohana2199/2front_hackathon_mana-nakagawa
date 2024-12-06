import React from 'react';
import { Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

interface SidebarComponentProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onItemSelect: (item: string) => void;
  drawerWidth?: number;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  mobileOpen,
  handleDrawerToggle,
  onItemSelect,
  drawerWidth = 240,
}) => (
  <>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerToggle}
      sx={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 1300,
      }}
    >
      <MenuIcon />
    </IconButton>
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <Sidebar onItemSelect={onItemSelect} />
    </Drawer>
  </>
);

export default SidebarComponent;

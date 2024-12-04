// src/components/Sidebar.tsx
import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText, ListItemButton } from '@mui/material';

const drawerWidth = 240;

interface SidebarProps {
  onItemSelect?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemSelect }) => {
  const handleItemClick = (item: string) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  return (
    <Box sx={{ width: drawerWidth, p: 2 }}>
      
      <Divider />
      <List>
  <ListItem disablePadding>
    <ListItemButton onClick={() => handleItemClick('プロフィール設定')}>
      <ListItemText primary="プロフィール設定" />
    </ListItemButton>
  </ListItem>
</List>

    </Box>
  );
};

export default Sidebar;

import React from 'react';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';


const drawerWidth = 240;

interface SidebarProps {
  onItemSelect?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemSelect }) => {
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    if (item === 'プロフィール設定') {
      navigate('/profile'); // プロフィール設定ページに遷移
    } else if (item === 'ホーム') {
      navigate('/home'); // ホームページに遷移
    }else if (item === 'ログアウト') {
      if (onItemSelect) {
        onItemSelect(item); // ログアウトなど、別の処理を通知
      }
    }
  };

  return (
    <Box sx={{ width: drawerWidth, p: 2, height: '100vh', bgcolor: '#f5f5f5', borderRight: '1px solid #ddd' }}>
      <Divider />
      <List sx={{ marginTop: 4 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleItemClick('ホーム')} sx={{
            borderRadius: 1,
            '&:hover': { bgcolor: '#e0e0e0' }
          }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="ホーム" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton onClick={() => handleItemClick('プロフィール設定')} sx={{
            borderRadius: 1,
            '&:hover': { bgcolor: '#e0e0e0' }
          }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="プロフィール設定" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton onClick={() => handleItemClick('ログアウト')} sx={{
            borderRadius: 1,
            '&:hover': { bgcolor: '#e0e0e0' }
          }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="ログアウト" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
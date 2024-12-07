import React from 'react';
import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    <Box sx={{ width: drawerWidth, p: 2 }}>
      <Divider />
      <List sx={{ marginTop: 4 }}>

        {/* ホームボタン */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleItemClick('ホーム')}>
            <ListItemText primary="ホーム" />
          </ListItemButton>
        </ListItem>
        {/* プロフィール設定ボタン */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleItemClick('プロフィール設定')}>
            <ListItemText primary="プロフィール設定" />
          </ListItemButton>
        </ListItem>
        
        {/* ログアウトボタン */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleItemClick('ログアウト')}>
            <ListItemText primary="ログアウト" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;

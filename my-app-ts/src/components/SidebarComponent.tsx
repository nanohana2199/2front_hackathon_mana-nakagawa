import React from 'react';
import { Drawer, IconButton, Box, useMediaQuery, BottomNavigation, BottomNavigationAction } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';


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
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)'); // モバイル判定
  const navigate = useNavigate();
  const handleItemClick = (item: string) => {
    if (item === 'ホーム') {
      navigate('/home');
    } else if (item === 'プロフィール設定') {
      navigate('/profile');
    } else if (item === 'ログアウト') {
      onItemSelect(item); // ログアウト処理を通知
    }
  };

  return (
    <>
      {/* デスクトップ用サイドバー */}
      {!isMobile && (
        <>
          
          <Drawer
            variant="persistent"
            open
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Sidebar onItemSelect={onItemSelect} />
          </Drawer>
        </>
      )}

      {/* モバイル用ボトムナビゲーション */}
      {isMobile && (
        <BottomNavigation
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 1300,
          }}
        >
          <BottomNavigationAction
            label="ホーム"
            icon={<HomeIcon />}
            onClick={() => handleItemClick('ホーム')}
          />
          <BottomNavigationAction
            label="プロフィール設定"
            icon={<AccountCircleIcon />}
            onClick={() => handleItemClick('プロフィール設定')}
          />
          <BottomNavigationAction
            label="ログアウト"
            icon={<LogoutIcon />}
            onClick={() => handleItemClick('ログアウト')}
          />
        </BottomNavigation>
      )}
    </>
  );
};

export default SidebarComponent;

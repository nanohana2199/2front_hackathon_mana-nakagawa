import React, { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import NewPostForm from '../components/NewPostForm';
import { Box, Button, Typography, Slide,useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useNavigate } from 'react-router-dom';
import SidebarComponent from '../components/SidebarComponent';

const drawerWidth = 240;

const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<string>('0分'); // 滞在時間の表示用
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navigate = useNavigate();
  let lastScrollY = 0;
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handleLogout = () => {
    console.log('ログアウト処理を実行します');
    try {
      navigate('/'); // リダイレクト
      console.log('リダイレクトしました');
    } catch (error) {
      console.error('ログアウト処理中にエラーが発生:', error);
    }
  };

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');

    if (loginTime) {
      const loginTimestamp = parseInt(loginTime, 10);

      const updateElapsedTime = () => {
        const currentTime = Date.now();
        const elapsedMilliseconds = currentTime - loginTimestamp;

        // 分単位を計算
        const minutes = Math.floor(elapsedMilliseconds / (1000 * 60));

        // フォーマットして滞在時間を設定
        const formattedTime = `${minutes}分`;
        setElapsedTime(formattedTime);
      };

      // 初回実行
      updateElapsedTime();

      // 1分ごとに更新
      const intervalId = setInterval(updateElapsedTime, 60 * 1000);

      // クリーンアップ
      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // スクロールダウンでヘッダーを隠す
        setShowHeader(false);
      } else {
        // スクロールアップでヘッダーを表示
        setShowHeader(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const handlePostSubmit = () => {
    setIsFormOpen(false); // 投稿完了後にフォームを閉じる
  };

   

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        onItemSelect={(item) => {
          console.log(`選択された項目: ${item}`);
          if (item === 'ログアウト') {
            handleLogout();
          }
        }}
      />
     {/* メインコンテンツ領域：UserProfileと同様にサイドバーの分だけマージンを取る */}
     <Box 
        sx={{ 
          flexGrow: 1, 
          marginLeft: isMobile ? 0 : `${drawerWidth}px`, 
          position: 'relative', 
          minHeight: '100vh', 
          p: 2 
        }}
      >
      <Slide direction="down" in={showHeader} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: '#64b5f6',
            color: 'white',
            p: 2,
            zIndex: 1000,
            boxShadow: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          
          <Typography variant="body1" sx={{ ml: 1 }}>滞在時間: {elapsedTime}</Typography>
        </Box>
      </Slide>

      {/* 投稿一覧 */}
      <PostList />

      {/* 右下の新規投稿ボタン */}
      <Button
        variant="contained"
        color="primary"
        onClick={openForm}
        sx={{
          position: 'fixed',
          bottom: 72,
          right: 16,
          borderRadius: '50%',
          minWidth: '56px',
          minHeight: '56px',
          boxShadow: 3,
        }}
      >
        <AddIcon />
      </Button>

      {/* 背景を暗くするオーバーレイ */}
      {isFormOpen && (
        <Box
          onClick={closeForm} // フォーム外クリックで閉じる
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景を暗くする
            zIndex: 998, // フォームより下に配置
          }}
        />
      )}

      {/* 新規投稿フォーム（スライドイン） */}
      <Slide direction="up" in={isFormOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999, // オーバーレイの上に配置
            top: '50%',
            
           
          }}
        >
          <Typography variant="h6" gutterBottom>
            
          </Typography>
          <NewPostForm onPostSubmit={handlePostSubmit} onClose={closeForm} />
        </Box>
      </Slide>
    </Box>
  </Box>
  );
};

export default HomePage;

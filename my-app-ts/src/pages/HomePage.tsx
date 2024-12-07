import React, { useState, useEffect } from 'react';
import PostList from '../components/PostList';
import NewPostForm from '../components/NewPostForm';
import { Box, Button, Typography, Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<string>('0分'); // 滞在時間の表示用
  let lastScrollY = 0;

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
    <Box sx={{ position: 'relative', minHeight: '100vh', p: 2 }}>
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">ホームページ</Typography>
          <Typography variant="body1">滞在時間: {elapsedTime}</Typography>
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

      {/* 新規投稿フォーム（スライドイン） */}
      <Slide direction="up" in={isFormOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            boxShadow: 4,
            p: 3,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Typography variant="h6" gutterBottom>
            新規投稿作成
          </Typography>
          <NewPostForm onPostSubmit={handlePostSubmit} onClose={closeForm} />
        </Box>
      </Slide>
    </Box>
  );
};

export default HomePage;

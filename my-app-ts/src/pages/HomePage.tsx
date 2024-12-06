import React, { useState } from 'react';
import PostList from '../components/PostList';
import NewPostForm from '../components/NewPostForm';
import {
  Box,
  Button,
  Typography,
  Slide,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const HomePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  

  const handlePostSubmit = () => {
    setIsFormOpen(false); // 投稿完了後にフォームを閉じる
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        ホーム
      </Typography>

      {/* 投稿一覧 */}
      <PostList />

      {/* 右下の新規投稿ボタン */}
      <Button
        variant="contained"
        color="primary"
        onClick={openForm}
        sx={{
          position: 'fixed',
          bottom: 16,
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

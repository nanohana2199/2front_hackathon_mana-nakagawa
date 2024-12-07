// src/components/NewPostForm.tsx
import React, { useState } from 'react';
import { createPost } from '../api/post'; // api.tsからインポート
import { Box, TextField, Button, Typography, CircularProgress, Alert, IconButton, useMediaQuery,Paper, Divider 
 } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCurrentUser from "../hooks/useCurrentUser";

interface NewPostFormProps {
  onPostSubmit?: () => void; // 投稿完了時のコールバック
  onClose?: () => void; // フォームを閉じるコールバック
}

const NewPostForm: React.FC <NewPostFormProps> = ({ onPostSubmit, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const userId = useCurrentUser(); // 現在のユーザーIDを取得
  const isMobile = useMediaQuery('(max-width: 800px)'); // モバイル判定
  const drawerWidth = isMobile ? 0 : 240; // サイドバーの幅を調整
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 空の投稿は送信しない
    if (!content.trim()) {
      setErrorMessage('投稿内容を入力してください');
      return;
    }
  
    setIsSubmitting(true);  // 投稿処理中の状態にする
    
    // 新規投稿データ
    const postData = { content,user_id: userId, };
  
    try {
      const createdPost = await createPost(postData); // createPost関数を呼び出す
  
      setContent('');  // フォームをリセット
      setErrorMessage('');  // エラーメッセージをクリア
  
      // 投稿送信後の処理（UI更新やリダイレクトなど）
      console.log('投稿が成功しました:', createdPost);

      // 投稿完了時に親コンポーネントに通知
      if (onPostSubmit) {
        onPostSubmit();
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        // エラーメッセージ（誹謗中傷エラーを含む）を表示
        setErrorMessage(error.message);
      }  else {
        setErrorMessage('予期しないエラーが発生しました'); // 型が異なる場合のエラーハンドリング
      }
    } finally {
      setIsSubmitting(false);  // 投稿処理終了
    }
  };

  return (
    <Box 
      sx={{ 
        ml: `${drawerWidth}px`, 
        px: isMobile ? 2 : 4,
        mt: 2,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          position: 'relative',
          maxWidth: isMobile ? '100%' : '800px', // モバイルでは全幅、それ以外は800pxに拡張
          width: '100%',
          borderRadius: 2,
          p:4,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
         
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{
              color: 'text.secondary',
              ml: 'auto',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

      

        <TextField
          multiline
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a post..."
          variant="outlined"
          fullWidth
          disabled={isSubmitting}
          error={!!errorMessage}
          helperText={errorMessage}
        />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
            sx={{
              fontWeight: 'bold',
            }}
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewPostForm;

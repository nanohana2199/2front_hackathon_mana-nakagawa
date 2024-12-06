// src/components/NewPostForm.tsx
import React, { useState } from 'react';
import { createPost } from '../api/post'; // api.tsからインポート
import { Box, TextField, Button, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
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
     component="form" 
     onSubmit={handleSubmit}
     sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
      <IconButton
      onClick={onClose}
      aria-label="close"
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
      }}
    >
      <CloseIcon />
      </IconButton>
      </Box>
      <TextField
        multiline
        rows={4}
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </Button>
      </Box>
    </Box>
  );
};

export default NewPostForm;

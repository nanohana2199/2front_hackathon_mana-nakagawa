// src/components/NewPostForm.tsx
import React, { useState,useRef } from 'react';
import { createPost } from '../api/post'; // api.tsからインポート
import { Box, TextField, Button, Typography, CircularProgress, Alert, IconButton, useMediaQuery,Paper, Divider,Avatar 
 } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image'; // 画像アイコン
import useCurrentUser from "../hooks/useCurrentUser";
import { storage, db } from '../firebase'; // Firebase設定ファイルをインポート
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface NewPostFormProps {
  onPostSubmit?: () => void; // 投稿完了時のコールバック
  onClose?: () => void; // フォームを閉じるコールバック
}

const NewPostForm: React.FC <NewPostFormProps> = ({ onPostSubmit, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userId = useCurrentUser(); // 現在のユーザーIDを取得
  const isMobile = useMediaQuery('(max-width: 800px)'); // モバイル判定
  const drawerWidth = isMobile ? 0 : 240; // サイドバーの幅を調整
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      // プレビュー用URLを作成
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUploadClick = () => {
    // ボタンクリックでinputをクリック
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `post_images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          reject(error);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // テキストも画像もない場合はエラー
    if (!content && !imageFile) {
      setErrorMessage('投稿内容か画像を入力してください');
      return;
    }
  
    setIsSubmitting(true);  // 投稿処理中の状態にする

    let imageUrl = null;
    try {
      if (imageFile) {
        const url = await uploadImage(imageFile);
        imageUrl = url;
      }
    
    // 新規投稿データ
    const postData = { content,user_id: userId,image_url: imageUrl  };
  
    
      const createdPost = await createPost(postData); // createPost関数を呼び出す
  
      setContent('');  // フォームをリセット
      setImageFile(null);
      setErrorMessage('');  // エラーメッセージをクリア
  
     

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
      setUploadProgress(0);
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
          maxWidth: isMobile ? '100%' : '800px',
          width: '100%',
          borderRadius: 2,
          p:4,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: '90vh', // 画面の90%高さを上限にする
          overflowY: 'auto' // スクロール可能にする
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">新規投稿</Typography>
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          multiline
          rows={5} // 行数を減らし、ボタンが見やすいようにする
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a post..."
          variant="outlined"
          fullWidth
          disabled={isSubmitting}
          error={!!errorMessage && !imageFile}
          helperText={!imageFile && errorMessage ? errorMessage : ''}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined"
            startIcon={<ImageIcon />}
            onClick={handleImageUploadClick}
            disabled={isSubmitting}
          >
            画像を添付
          </Button>
          {imagePreview && (
            <Avatar 
              variant="rounded"
              src={imagePreview} 
              alt="preview"
              sx={{ width: 80, height: 80, borderRadius: 2 }}
            />
          )}
        </Box>

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          disabled={isSubmitting}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Typography variant="body2">画像アップロード中: {uploadProgress.toFixed(0)}%</Typography>
        )}

        {errorMessage && imageFile && (
          <Alert severity="error">{errorMessage}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
            sx={{ fontWeight: 'bold' }}
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewPostForm;

import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { storage, db } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ProfileSetupPage: React.FC = () => {
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false); 
  const auth = getAuth();
  const navigate = useNavigate();

  // 画面幅による判定
  const isMobile = useMediaQuery('(max-width:800px)');

  const fetchUserProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("ログインしてください");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || '');
        setProfileImage(data.profileImage || null);
        setBackgroundImage(data.backgroundImage || null);
      }
    } catch (error) {
      console.error("プロフィール情報の取得エラー:", error);
      alert("プロフィール情報の取得に失敗しました");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
    }
  };

  const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedBackgroundImage(file);
      const previewUrl = URL.createObjectURL(file);
      setBackgroundImage(previewUrl);
    }
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("ログインしてください");
      return;
    }

    try {
      let profileImageUrl = profileImage;
      let backgroundImageUrl = backgroundImage;

      if (selectedProfileImage) {
        const profileImageRef = ref(storage, `profile-images/${user.uid}/${selectedProfileImage.name}`);
        await uploadBytes(profileImageRef, selectedProfileImage);
        profileImageUrl = await getDownloadURL(profileImageRef);
      }

      if (selectedBackgroundImage) {
        const backgroundImageRef = ref(storage, `background-images/${user.uid}/${selectedBackgroundImage.name}`);
        await uploadBytes(backgroundImageRef, selectedBackgroundImage);
        backgroundImageUrl = await getDownloadURL(backgroundImageRef);
      }

      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        bio,
        profileImage: profileImageUrl,
        backgroundImage: backgroundImageUrl,
      });

      setOpenDialog(true);
    } catch (error) {
      console.error("Firestoreエラー:", error);
      alert("プロフィールの保存に失敗しました");
    }
  };

  return (
<div style={{ margin: '0', padding: '0' }}>
<style>
    {`
      body, html {
        margin: 0;
        padding: 0;
         box-sizing: border-box; 
      }
    `}
  </style>
    {/* 画面幅いっぱいに表示する青色のヘッダーエリア */}
    <Box 
    sx={{ 
      width: '100%', 
      backgroundColor: '#64b5f6',
      py: 2, // 上下余白
      margin: 0, // 外側の余白を完全にゼロに
      //上下余白
      position: 'relative', /* 上部に固定 */
    }}
  >
    <Typography
      variant="h4"
      sx={{ 
        textAlign: 'center', 
        mb: 0, 
        fontWeight: 'nomal', 
        color: '#fff', 
        
      }}
    >
      プロフィール設定
    </Typography>
  </Box>
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', gap: 2 }}>
      {/* <Typography
        variant="h4"
        sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold', color: '#333', fontFamily: "'Roboto', sans-serif" }}
      >
        プロフィール設定
      </Typography> */}
  
      {/* 背景画像 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          borderRadius: '8px',
          mb: 3,
        }}
      >
        <img
          src={backgroundImage || '../images/default-background.png'}
          alt="Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!isMobile && (
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              borderRadius: '20px',
              textTransform: 'none',
              padding: '6px 12px',
              color: '#1976d2',
              borderColor: '#1976d2',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              ':hover': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
            }}
          >
            背景変更
            <input
              id="background-image-input"
              type="file"
              accept="image/*"
              hidden
              onChange={handleBackgroundImageChange}
            />
          </Button>
        )}
      </Box>
  
      {/* モバイルの場合、背景画像変更ボタンを下に配置 */}
      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              padding: '6px 12px',
              color: '#1976d2',
              borderColor: '#1976d2',
              ':hover': {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
            }}
          >
            背景変更
            <input
              id="background-image-input-mobile"
              type="file"
              accept="image/*"
              hidden
              onChange={handleBackgroundImageChange}
            />
          </Button>
        </Box>
      )}

      {/* プロフィール画像 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={profileImage || '../images/default-avatar.png'}
          alt="Profile Image"
          sx={{
            width: 120,
            height: 120,
            border: '3px solid white',
            // モバイル時はマイナスマージンを外して被りを回避
            marginTop: isMobile ? 0 : '-60px',
          }}
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            padding: '10px 20px',
            color: '#1976d2',
            borderColor: '#1976d2',
            ':hover': {
              backgroundColor: '#1976d2',
              color: '#fff',
            },
            mt: 2,
          }}
        >
          アイコン変更
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileImageChange}
          />
        </Button>
      </Box>
  
      {/* 自己紹介の入力 */}
      <TextField
        label="自己紹介"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 3 }}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
  
      {/* 保存ボタン */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleSaveProfile}>
          保存
        </Button>
        <Button onClick={() => navigate('/home')} color="primary">
          ホームへ戻る
        </Button>
      </Box>
  
      {/* 保存完了後のダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>プロフィール保存成功</DialogTitle>
        <DialogContent>プロフィールが正常に保存されました。</DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/home')} color="primary">
            ホームへ戻る
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </div>
  );
};

export default ProfileSetupPage;

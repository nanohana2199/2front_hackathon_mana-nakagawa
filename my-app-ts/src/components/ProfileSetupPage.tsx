import React, { useEffect,useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { storage, db } from '../firebase'; // Firebase設定ファイルをインポート
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ProfileSetupPage: React.FC = () => {
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // ダイアログ表示状態
  const auth = getAuth();
  const navigate = useNavigate();

   // プロフィール情報を取得する関数
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
        setBio(data.bio || ''); // Firestoreのbioをセット
        setProfileImage(data.profileImage || null); // プロフィール画像URLをセット
      }
    } catch (error) {
      console.error("プロフィール情報の取得エラー:", error);
      alert("プロフィール情報の取得に失敗しました");
    }
  };

  // 初期化処理でプロフィール情報を取得
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
    }
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("ログインしてください");
      return;
    }

    try {
      let imageUrl = profileImage;
      if (selectedImage) {
        const imageRef = ref(storage, `profile-images/${user.uid}/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { bio, profileImage: imageUrl });

      // 保存成功後、ダイアログを表示
      setOpenDialog(true);
    } catch (error) {
      console.error("Firestoreエラー:", error);
      alert("プロフィールの保存に失敗しました");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto'}}>
      <Typography variant="h4" sx={{ mb: 3 ,textAlign: 'center'}}>
        プロフィール設定
      </Typography>
      {/* プロフィール画像のアップロード */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 ,justifyContent: 'center',flexDirection: 'column'}}>
        <Avatar
          src={profileImage || '/default-avatar.png'}
          alt="Profile Image"
          sx={{ width: 200, height: 200, mr: 2 }}
        />
        <IconButton component="label" sx={{ textAlign: 'center' }}>
          <Typography variant="body2">画像を変更</Typography>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </IconButton>
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
      <Button variant="contained" color="primary" onClick={handleSaveProfile}>
        保存
      </Button>
      <Button onClick={() => navigate('/home')} color="primary">
            ホームへ戻る
          </Button>

      {/* 保存完了後のダイアログ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>プロフィール保存成功</DialogTitle>
        <DialogContent>
          プロフィールが正常に保存されました。
        </DialogContent>
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
  );
};

export default ProfileSetupPage;

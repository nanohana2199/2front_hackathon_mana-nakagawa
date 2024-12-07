import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PostList from './PostList';
import { Box, Avatar, Typography, CircularProgress,} from '@mui/material';

interface UserDetails {
  profileImage: string;
  backgroundImage: string;
  bio: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log('Firestoreから取得したデータ:', docSnap.data());

          const data = docSnap.data() as UserDetails;

          // デフォルト画像の設定
          setUserDetails({
            profileImage: data.profileImage || '/images/default-avatar.png',
            backgroundImage: data.backgroundImage || '/images/default-background.png',
            bio: data.bio || '自己紹介文はまだありません。',
          });
        } else {
          setUserDetails(null); // ユーザーが見つからない場合
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box sx={{  maxWidth: { xs: '100%', sm: 600, md: 800 }, textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          ユーザー情報が見つかりません。
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 'auto', mt: 4, textAlign: 'center' }}>
      {/* 背景画像 */}
      {userDetails.backgroundImage && (
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
            src={userDetails.backgroundImage}
            alt="User Background"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
      <Avatar
        src={userDetails.profileImage}
        alt="User Avatar"
        sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
      />
      <Typography variant="h5" gutterBottom>
        プロフィール
      </Typography>
      <Typography variant="body1">
        {userDetails.bio || '自己紹介文はありません。'}
      </Typography>
   

    <Typography variant="h5" gutterBottom>
      投稿一覧
    </Typography>
    
    <PostList userId={userId} />
    
  </Box>
  );
};

export default UserProfile;

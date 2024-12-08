import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PostList from './PostList';
import {
  Box, Avatar, Typography, CircularProgress, Divider, Paper, useMediaQuery
} from '@mui/material';
import SidebarComponent from './SidebarComponent';

interface UserDetails {
  profileImage: string;
  backgroundImage: string;
  bio: string;
}

const drawerWidth = 240; // サイドバーの幅

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 800px)'); // モバイル判定

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
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log('Firestoreから取得したデータ:', docSnap.data());
          const data = docSnap.data() as UserDetails;

          setUserDetails({
            profileImage: data.profileImage || '/images/default-avatar.png',
            backgroundImage: data.backgroundImage || '/images/default-background.png',
            bio: data.bio || '自己紹介文はまだありません。',
          });
        } else {
          setUserDetails(null);
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
      <Box sx={{ maxWidth: { xs: '100%', sm: 600, md: 800 }, textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          ユーザー情報が見つかりません。
        </Typography>
      </Box>
    );
  }

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
      {/* メインコンテンツ領域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // isMobileがtrueなら0、falseならdrawerWidth分左にスペース
          marginLeft: isMobile ? 0 : `${drawerWidth}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2, width: '100%', maxWidth: 800 }}>
  <Box sx={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f5f5f5' }}>
    {userDetails.backgroundImage && (
      <img
        src={userDetails.backgroundImage}
        alt="User Background"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )}
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', mt: '-40px', px: 2 }}> {/* アバター位置とテキストエリア調整 */}
    <Avatar
      src={userDetails.profileImage}
      alt="User Avatar"
      sx={{
        width: 120,
        height: 120,
        border: '4px solid white',
        boxShadow: 2,
        mr: 2, // テキストとの間に余白を設定
      }}
    />
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: '60px' }}> {/* アバター高さの半分から開始 */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          ml: 1, // 左方向の余白を調整
        }}
      >
        {userDetails.bio || '自己紹介文はありません。'}
      </Typography>
      </Box>
  </Box>
</Paper>


        <Divider sx={{ mb: 2, width: '100%', maxWidth: 800 }} />

        {/* 投稿一覧エリア */}
        <Box sx={{ width: '100%', maxWidth: 800,display: 'flex' ,justifyContent: 'center'}}>
          {/* <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            投稿一覧
          </Typography> */}

   
          <PostList userId={userId} />
     

        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;

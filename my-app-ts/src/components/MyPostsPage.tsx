import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import PostList from './PostList';
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Divider,
  Paper,
  useMediaQuery
} from '@mui/material';
import SidebarComponent from './SidebarComponent';
import useCurrentUser from '../hooks/useCurrentUser';

interface UserDetails {
  profileImage: string;
  backgroundImage: string;
  bio: string;
}

const drawerWidth = 240;

const MyPostsPage: React.FC = () => {
  const user_id = useCurrentUser();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handleLogout = () => {
    try {
      navigate('/');
    } catch (error) {
      console.error('ログアウト処理中にエラーが発生:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user_id) return;
      try {
        const docRef = doc(db, 'users', user_id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
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
  }, [user_id]);

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
          if (item === 'ログアウト') {
            handleLogout();
          }
        }}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
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

          <Box sx={{ p: 2, position: 'relative', textAlign: 'center' }}>
            <Avatar
              src={userDetails.profileImage}
              alt="User Avatar"
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                position: 'relative',
                mt: '-60px',
                mx: 'auto',
                boxShadow: 2
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                あなたの投稿
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {userDetails.bio || '自己紹介文はありません。'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Divider sx={{ mb: 2, width: '100%', maxWidth: 800 }} />

        {/* 投稿一覧エリア */}
        <Box sx={{ width: '100%', maxWidth: 800, display: 'flex', justifyContent: 'center'}}>
          <PostList userId={user_id || ''}showDeleteButton={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default MyPostsPage;

import React, { useState } from 'react';
import { Post } from '../types';
import LikeButton from './LikeButton';
import NewReplyForm from './NewReplyForm';
import useCurrentUser from '../hooks/useCurrentUser';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

interface PostItemProps {
  post: Post;
  replies: any[]; // リプライのデータ
}

const drawerWidth = 240;

const PostItemWithSidebar: React.FC<PostItemProps> = ({ post, replies }) => {
  const user_id = useCurrentUser();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarItemSelect = (item: string) => {
    console.log(`選択された項目: ${item}`);
  };

  if (user_id === null) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          ユーザーがログインしていません
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      {/* 三本線アイコン */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          top: 16, // 上部からの位置
          left: 16, // 左側からの位置
          zIndex: 1300, // サイドバーより上に表示
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* サイドバー */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // モバイルパフォーマンス向上
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Sidebar onItemSelect={handleSidebarItemSelect} />
      </Drawer>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Card sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {post.content}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <CardActions>
              <LikeButton post_id={Number(post.id)} user_id={user_id} />
              <Button
                variant="outlined"
                onClick={() => setIsReplying(!isReplying)}
                sx={{ ml: 2 }}
              >
                {isReplying ? 'キャンセル' : 'リプライ'}
              </Button>
            </CardActions>
            {isReplying && (
              <Box sx={{ mt: 2 }}>
                <NewReplyForm postId={Number(post.id)} user_id={user_id} />
              </Box>
            )}
          </CardContent>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              リプライ
            </Typography>
            {replies.length > 0 ? (
              <List>
                {replies.map((reply, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <Avatar>{reply.userName ? reply.userName[0] : '?'}</Avatar>
                    <ListItemText
                      primary={reply.content}
                      secondary={reply.userName || '匿名ユーザー'}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                リプライはありません
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PostItemWithSidebar;

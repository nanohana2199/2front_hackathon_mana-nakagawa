// src/components/PostItemWithSidebar.tsx
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
  Toolbar,
  AppBar,
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
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            投稿詳細
          </Typography>
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // モバイルでパフォーマンスを向上させるため
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Sidebar onItemSelect={handleSidebarItemSelect} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Sidebar onItemSelect={handleSidebarItemSelect} />
      </Drawer>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
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

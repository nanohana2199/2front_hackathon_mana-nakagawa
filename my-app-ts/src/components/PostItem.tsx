// src/components/PostItem.tsx
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
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

interface PostItemProps {
  post: Post;
  replies: any[]; // リプライのデータ
}

const PostItem: React.FC<PostItemProps> = ({ post, replies }) => {
  const user_id = useCurrentUser();
  const [isReplying, setIsReplying] = useState<boolean>(false);

  if (user_id === null) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          ユーザーがログインしていません
        </Typography>
      </Box>
    );
  }

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  return (
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
            onClick={handleReplyClick}
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

      {/* リプライの表示 */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          リプライ
        </Typography>
        {replies.length > 0 ? (
          <List>
            {replies.map((reply, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{reply.userName ? reply.userName[0] : '?'}</Avatar>
                </ListItemAvatar>
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
  );
};

export default PostItem;

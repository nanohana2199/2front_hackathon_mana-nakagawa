import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LikeButton from './LikeButton';
import RepliesToggleSection from './RepliesToggleSection';

interface PostItemMainProps {
  postContent: string;
  postId: number;
  userId: string | null;
  replies: any[];
  onReplySubmit: (content: string) => void;
}

const PostItemMain: React.FC<PostItemMainProps> = ({
  postContent,
  postId,
  userId,
  replies,
  onReplySubmit,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReplySubmit(replyContent);
      setReplyContent('');
      setIsReplying(false); // 送信後に返信フォームを閉じる
    }
  };

  return (
    <Card sx={{ mb: 2, p: 2, maxWidth: '600px', mx: 'auto' }}>
      <CardContent>
        <Typography variant="body1" gutterBottom>
          {postContent}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', p: 1 }}>
        <LikeButton post_id={postId} user_id={userId || ''} />
        <IconButton
          onClick={() => setIsReplying(!isReplying)}
          sx={{
            color: isReplying ? 'blue' : 'gray',
            transition: 'color 0.2s ease',
            ml: 2,
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Box>

      {/* 返信作成フォーム */}
      {isReplying && (
        <Box sx={{ mt: 2 }}>
          <textarea
            placeholder="コメントする"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Button onClick={handleReplySubmit} sx={{ mt: 1 }}>
            投稿
          </Button>
        </Box>
      )}

      {/* リプライ表示 */}
      <RepliesToggleSection replies={replies} />
    </Card>
  );
};

export default PostItemMain;

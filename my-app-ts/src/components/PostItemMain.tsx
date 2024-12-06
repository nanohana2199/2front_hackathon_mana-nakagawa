import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LikeButton from './LikeButton';
import RepliesToggleSection from './RepliesToggleSection';
import UserBioModal from './UserBioModal';

interface Reply {
  id: number;
  content: string;
  user_id: string;
  userAvatar: string;
}

interface PostItemMainProps {
  postContent: string;
  postId: number;
  userId: string | null;
  author: string; // 投稿者名を表示
  authorUserId: string; // 投稿者のユーザーID（新規追加）
  replies: any[];
  userAvatar?: string | null;
  onReplySubmit: (content: string) => void;
}

const PostItemMain: React.FC<PostItemMainProps> = ({
  postContent,
  postId,
  userId,
  author,
  authorUserId, // 投稿者のユーザーIDを受け取る
  replies,
  userAvatar,
  onReplySubmit,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isBioModalOpen, setIsBioModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // モーダルに渡すユーザーID


  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReplySubmit(replyContent);
      setReplyContent('');
      setIsReplying(false); // 送信後に返信フォームを閉じる
    }
  };

    // アバターをクリックしたときの処理
    const handleAvatarClick = (id: string) => {
      setSelectedUserId(id); // クリックされたアバターのユーザーIDをセット
      setIsBioModalOpen(true); // モーダルを開く
    };

  

  return (
    <Card sx={{ mb: 2, p: 2, maxWidth: '600px', mx: 'auto' }}>
      <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
  
  <Box sx={{ mr: 2 }}>
    <img
      src={userAvatar || '/images/default-avatar.png'}
      alt="User Avatar"
      style={{ width: 50, height: 50, borderRadius: '50%' }}
      onError={(e) => {
        console.warn('Failed to load avatar:', userAvatar);
        e.currentTarget.src = '/images/default-avatar.png'; // 明示的にデフォルト画像を設定
      }}
      onClick={() => handleAvatarClick(authorUserId)} // アロー関数でuserIdを渡す
    />
  </Box>
  
  <Typography variant="h6" gutterBottom sx={{ mr: 2 }}>
    {author} {/* ユーザー名を表示 */}
  </Typography>
</Box>

        {/* コンテンツ部分 */}
    <Box sx={{ pl: 8, mt: 1 }}> {/* 左側にスペースを追加 */}
      <Typography variant="body1" gutterBottom>
        {postContent}
      </Typography>
    </Box>
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
        <Box >
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
           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button onClick={handleReplySubmit} >
            返信
          </Button>
          </Box>
          
        </Box>
      )}

      {/* リプライ表示 */}
      <RepliesToggleSection replies={replies} />

      {/* Bioモーダルを表示 */}
      <UserBioModal
        userId={selectedUserId|| ''}
        open={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
      />
    </Card>
  );
};

export default PostItemMain;

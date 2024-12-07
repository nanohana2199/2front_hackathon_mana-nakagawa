import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button, Divider } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LikeButton from './LikeButton';
import RepliesToggleSection from './RepliesToggleSection';
import UserBioModal from './UserBioModal';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { useMediaQuery } from '@mui/material';

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
  created_at:string;
  onReplySubmit: (content: string) => void;
  onAvatarClick: (userId: string) => void;
}

const PostItemMain: React.FC<PostItemMainProps> = ({
  postContent,
  postId,
  userId,
  author,
  authorUserId, // 投稿者のユーザーIDを受け取る
  replies,
  userAvatar,
  created_at,
  onReplySubmit,
  onAvatarClick
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isBioModalOpen, setIsBioModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // モーダルに渡すユーザーID
  const navigate = useNavigate(); // useNavigateを初期化
  const isMobile = useMediaQuery('(max-width: 600px)'); // モバイル判定
  


  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReplySubmit(replyContent);
      setReplyContent('');
      setIsReplying(false); // 送信後に返信フォームを閉じる
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月は0始まりなので+1
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };
  

  

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', pb: 2,marginLeft: isMobile ? 0 :'240px'}}>
    {/* 投稿内容 */}
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
  {/* ユーザー情報 */}
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <img
      src={userAvatar || '/images/default-avatar.png'}
      alt="User Avatar"
      style={{ width: 50, height: 50, borderRadius: '50%' }}
      onError={(e) => {
        console.warn('Failed to load avatar:', userAvatar);
        e.currentTarget.src = '/images/default-avatar.png'; // 明示的にデフォルト画像を設定
      }}
      onClick={() => onAvatarClick(authorUserId)} // アロー関数でuserIdを渡す
    />
    <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
      {author} {/* 投稿者名をアバターのすぐ右に表示 */}
    </Typography>
  </Box>

  {/* 作成日時 */}
  <Typography variant="body2" color="textSecondary">
    {formatDate(created_at)} {/* 作成日をフォーマット */}
  </Typography>
</Box>

        {/* コンテンツ部分 */}
    <Box sx={{ pl: 8, mt: 1 }}> {/* 左側にスペースを追加 */}
      <Typography variant="body1" gutterBottom>
        {postContent}
      </Typography>
    </Box>
      
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
          <ChatBubbleOutlineIcon sx={{ fontSize: '16px' }} />
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

      </Box>

      {/* 横線で仕切り */}
      <Divider />
    </Box>   
    
  );
};

export default PostItemMain;

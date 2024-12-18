import React, { useState, useEffect } from 'react';
import { Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LikeButton from './LikeButton';
import RepliesToggleSection from './RepliesToggleSection';
import UserBioModal from './UserBioModal';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import { useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
  onDelete?: () => void; // 追加
  postImageUrl?: string | null; // ←追加: 画像URLをオプショナルで受け取る
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
  onAvatarClick,
  onDelete,
  postImageUrl
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>('');
  const [isBioModalOpen, setIsBioModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // モーダルに渡すユーザーID
  const navigate = useNavigate(); // useNavigateを初期化
  const isMobile = useMediaQuery('(max-width: 800px)'); // モバイル判定
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);


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
    <Box>
    <Card
      variant="outlined"
      sx={{ mb: 2, borderRadius: 2, boxShadow: 1, minWidth: '400px' }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={userAvatar || '/images/default-avatar.png'}
            alt="User Avatar"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              console.warn('Failed to load avatar:', userAvatar);
              target.src = '/images/default-avatar.png';
            }}
            onClick={() => onAvatarClick(authorUserId)}
            sx={{ cursor: 'pointer' }}
          />
        }
        title={
          <Box>
            {/* 投稿者名と投稿内容を同じ`Box`に配置 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {author}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'right', ml: 2 }}
              >
                {formatDate(created_at)}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
            >
              {postContent}
            </Typography>
          </Box>
        }
        sx={{ pb: 0 }}
      />
  
      {postImageUrl && (
        <Box sx={{ mt: 2, px: 2 }}>
          <img
            src={postImageUrl}
            alt="Post Image"
            style={{ maxWidth: '100%', maxHeight: '300px', // 高さの制限を設定
              objectFit: 'cover',borderRadius: '8px' }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/images/default-image.png';
            }}
          />
        </Box>
      )}
  
      <CardContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LikeButton post_id={postId} user_id={userId || ''} />
          <IconButton
            onClick={() => setIsReplying(!isReplying)}
            sx={{
              ml: 2,
              color: isReplying ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s ease',
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: '16px' }} />
          </IconButton>
  
          {onDelete && (
  <Box sx={{ ml: 2 }}>
    <IconButton
  onClick={() => setShowConfirmDelete(true)}
  sx={{
    color: 'error.main',
    '&:hover': {
      backgroundColor: 'error.light', // ホバー時の背景色
      transform: 'scale(1.05)', // 拡大
      transition: 'transform 0.2s ease',
    },
  }}
>
  <DeleteIcon sx={{ fontSize: '16px' }} />
</IconButton>

    {/* 削除確認モーダル */}
    {showConfirmDelete !== undefined && (
      <Dialog
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
      >
        <DialogTitle>削除の確認</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            本当にこの投稿を削除しますか？ この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDelete(false)} color="primary">
            キャンセル
          </Button>
          <Button
            onClick={() => {
              if (onDelete) {
                onDelete(); // onDelete が存在する場合にのみ呼び出す
              }
              setShowConfirmDelete(false);
            }}
            color="error"
            variant="contained"
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    )}
  </Box>
)}

</Box>
  
        {/* 返信フォーム */}
        {isReplying && (
          <Box sx={{ mt: 2 }}>
            <TextField
              placeholder="コメントする"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="contained" onClick={handleReplySubmit}>
                返信
              </Button>
            </Box>
          </Box>
        )}
  
        <RepliesToggleSection replies={replies} />
      </CardContent>
    </Card>
  </Box>
  
    
  );
};

export default PostItemMain;

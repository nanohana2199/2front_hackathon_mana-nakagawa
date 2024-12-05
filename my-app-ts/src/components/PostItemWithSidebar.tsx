import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SidebarComponent from './SidebarComponent';
import PostItemMain from './PostItemMain';
import useCurrentUser from '../hooks/useCurrentUser';
import { createReply, getReplies } from '../api/reply';
import { useNavigate } from 'react-router-dom';

interface Reply {
  id: number;
  content: string;
  userName?: string; // ユーザー名（任意）
}

interface PostItemWithSidebarProps {
  post: {
    id: number;
    content: string;
  };
  replies: any[]; // これを追加
}

const PostItemWithSidebar: React.FC<PostItemWithSidebarProps> = ({ post }) => {
  const user_id = useCurrentUser();
  const [isReplying, setIsReplying] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const navigate = useNavigate(); // useNavigate を使用


  const handleLogout = () => {
    console.log('ログアウト処理を実行します');
    try {
      // 必要な処理があればここに追加
      navigate('/'); // リダイレクト
      console.log('リダイレクトしました'); // リダイレクト後にログを表示
    } catch (error) {
      console.error('ログアウト処理中にエラーが発生:', error);
    }
  };
  

  // リプライを取得
  const fetchReplies = async () => {
    try {
      const fetchedReplies = await getReplies(post.id);
      setReplies(fetchedReplies || []); // 空配列フォールバック
    } catch (error) {
      console.error('リプライの取得に失敗しました:', error);
    }
  };

  // リプライを投稿
  const handleReplySubmit = async (content: string) => {
    if (!content.trim()) return; // 空文字を無視
    const replyData = { content, postId: post.id, user_id: user_id || '' };
    try {
      await createReply(replyData);
      fetchReplies(); // 送信後にリプライを再取得
    } catch (error) {
      console.error('リプライ送信中にエラーが発生しました:', error);
    }
  };

  // 初回レンダリング時にリプライを取得
  useEffect(() => {
    fetchReplies();
  }, [post.id]);

  // ログインしていない場合
  if (!user_id) {
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
      {/* サイドバー */}
      <SidebarComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        onItemSelect={(item) => {
         console.log(`選択された項目: ${item}`);
         if (item === 'ログアウト') {
           handleLogout(); // ログアウト処理を呼び出す
         }
       }}
    />

      {/* メインコンテンツ */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* 投稿の内容 */}
        <PostItemMain
          postContent={post.content}
          postId={post.id}
          userId={user_id}
          replies={replies}
          onReplySubmit={handleReplySubmit}
        />
      </Box>
    </Box>
  );
};

export default PostItemWithSidebar;

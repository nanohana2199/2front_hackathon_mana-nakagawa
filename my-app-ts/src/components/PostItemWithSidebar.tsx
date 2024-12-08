import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import SidebarComponent from './SidebarComponent';
import PostItemMain from './PostItemMain';
import useCurrentUser from '../hooks/useCurrentUser';
import { createReply, getReplies } from '../api/reply';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


interface Reply {
  id: number;
  content: string;
  userName?: string; // ユーザー名（任意）
  user_id:string;
  userAvatar?: string;
}

interface PostItemWithSidebarProps {
  post: {
    id: number;
    content: string;
    author: string; // 新規追加
    user_id :string;
    created_at :string;
    image_url :string | null;


  };
  replies: any[]; // これを追加
  onDelete?: () => Promise<void>; // ここで onDelete をオプショナルプロパティとして追加
  onAvatarClick: (userId: string) => void; // 新しいプロップ
}

const PostItemWithSidebar: React.FC<PostItemWithSidebarProps> = ({ post, onAvatarClick,onDelete }) => {
  const user_id = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [isReplying, setIsReplying] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const navigate = useNavigate(); // useNavigate を使用
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user_id !== undefined) {
      // user_id が判明したらローディングを終了
      setIsLoading(false);
    }
  }, [user_id]);

  const handleLogout = () => {
    console.log('ログアウト処理を実行します');
    try {
      navigate('/'); // リダイレクト
      console.log('リダイレクトしました'); // リダイレクト後にログを表示
    } catch (error) {
      console.error('ログアウト処理中にエラーが発生:', error);
    }
  };

  const handleAvatarClick = (userId: string) => {
    if (!userId) {
      console.warn('無効なユーザーIDです');
      return;
    }
  
    navigate(`/user/${userId}`); // プロフィールページへ遷移
  };

  // リプライを取得
  const fetchReplies = async () => {
    try {
      const fetchedReplies = await getReplies(post.id);
      console.log('Fetched replies:', fetchedReplies);

      const repliesWithAvatars = await Promise.all(
        (fetchedReplies || []).map(async (reply: Reply) => {
          const docRef = doc(db, 'users', reply.user_id);
          const docSnap = await getDoc(docRef);
          const userAvatar = docSnap.exists()
            ? docSnap.data().profileImage || '/images/default-avatar.png'
            : '/images/default-avatar.png';
          return { ...reply, userAvatar };
        })
      );

      console.log('Replies with avatars:', repliesWithAvatars);

      setReplies(repliesWithAvatars|| []); // 空配列フォールバック
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

  // ユーザーアバターを取得
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!post.user_id || post.user_id === 'default_user_id') {
        console.warn('Invalid or default user ID:', post.user_id);
        setUserAvatar('/default-avatar.png'); // デフォルト画像を設定
        return;
      }

      console.log('Fetching avatar for user ID:', post.user_id); // デバッグログ

      try {
        const docRef = doc(db, 'users', post.user_id); // Firestoreでuser_idを使用
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profileImage = docSnap.data().profileImage || '/default-avatar.png';
          console.log('Fetched profile image:', profileImage);
          setUserAvatar(profileImage);
        } else {
          console.warn('No document found for user ID:', post.user_id);
          setUserAvatar('/default-avatar.png'); // デフォルトにフォールバック
        }
      } catch (error) {
        console.error('ユーザーアバターの取得に失敗しました:', error);
        setUserAvatar('/default-avatar.png'); // デフォルトにフォールバック
      }
    };

    fetchUserAvatar();
  }, [post.user_id]);

  // 条件付きでコンテンツを表示
  if (isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress />
        
      </Box>
    );
  }
 


  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* サイドバー */}
      {/* <SidebarComponent
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        onItemSelect={(item) => {
          console.log(`選択された項目: ${item}`);
          if (item === 'ログアウト') {
            handleLogout(); // ログアウト処理を呼び出す
          }
        }}
      /> */}

      {/* メインコンテンツ */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <PostItemMain
          postContent={post.content}
          postId={post.id}
          userId={user_id}
          replies={replies}
          author={post.author} // 追加
          authorUserId ={post.user_id}
          created_at={post.created_at}
          userAvatar={userAvatar} // アバターを渡す
          onReplySubmit={handleReplySubmit}
          onAvatarClick={handleAvatarClick}
          onDelete={onDelete}
          postImageUrl={post.image_url || null} // 追加
        />
      </Box>
    </Box>
  );
};

export default PostItemWithSidebar;

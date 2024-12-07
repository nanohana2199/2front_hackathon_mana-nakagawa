import React, { useState, useEffect } from 'react';
import PostItem from './PostItemWithSidebar';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { deletePost, getPosts } from '../api/post';
import { getReplies } from '../api/reply';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';


interface RepliesMap {
  [postId: string]: any[];
}

interface PostListProps {
  userId?: string; // 特定のユーザーIDを指定する場合は渡す
  showDeleteButton?: boolean; // 新規追加
}

type UserMap = {
  [user_id: string]: string; // user_idをキーにprofileImageのURLを保持
};

type Post = {
  id: number;
  content: string;
  author: string;
  user_id: string;
  created_at: string;
 }

const PostList: React.FC<PostListProps> = ({userId, showDeleteButton = false}) => {
  const [posts, setPosts] = useState<Post[]>([]); // 初期値を空配列
  const [replies, setReplies] = useState<RepliesMap>({}); // 初期値を空オブジェクト
  const [userAvatars, setUserAvatars] = useState<UserMap>({});
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null); 
  const navigate = useNavigate(); 

  
    const fetchPosts = async () => {
      try {
        const data = await getPosts(userId); // データが null の場合に備えて空配列を代入
        const sortedPosts = data.sort((a: Post, b: Post) => b.id - a.id);
        setPosts(sortedPosts);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(`投稿の取得に失敗しました: ${error.message}`);
        }
      }
    };
    useEffect(() => {
    fetchPosts();
  }, [userId]);

  const handleDelete = async (postId: number) => {
    if (!showDeleteButton) return;
    try {
      await deletePost(postId);
      setNotification('投稿を削除しました！'); // 通知を設定
      fetchPosts(); // 再取得
    } catch (err: any) {
      alert(`削除に失敗しました: ${err.message}`);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000); // 3秒後に通知を消す
      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [notification]);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!posts || posts.length === 0) return; // 投稿がない場合は処理しない
      try {
        const repliesData = await Promise.all(
          posts.map(async (post) => {
            const repliesForPost = await getReplies(Number(post.id));
            return { postId: post.id, replies: repliesForPost || [] }; // 空配列にフォールバック
          })
        );
        const repliesMap: RepliesMap = repliesData.reduce((acc: RepliesMap, { postId, replies }) => {
          acc[String(postId)] = replies;
          return acc;
        }, {});
        setReplies(repliesMap);
      } catch (error) {
        if (error instanceof Error) {
          setError(`リプライの取得に失敗しました: ${error.message}`);
        }
      }
    };

    fetchReplies();
  }, [posts]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const userIds = Array.from(
        new Set([
          ...posts.map((post) => post.user_id),
          ...Object.values(replies).flatMap((replyList) =>
            replyList.map((reply) => reply.user_id)
          ),
        ])
      );

      const userMap: UserMap = {};
      const userDocs = await Promise.all(
        userIds.map(async (userId) => {
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          return { userId, profileImage: docSnap.exists() ? docSnap.data().profileImage : null };
        })
      );

      userDocs.forEach(({ userId, profileImage }) => {
        userMap[userId] = profileImage || '/images/default-avatar.png';
      });

      setUserAvatars(userMap);
    };

    fetchAvatars();
  }, [posts, replies]);

  const handleAvatarClick = (userId: string) => {
    if (!userId) {
      console.warn('無効なユーザーIDです');
      return;
    }
    navigate(`/user/${userId}`); // ユーザーIDに基づいてプロフィールページへ遷移
  };



  return (
    <div>
      <Snackbar
        open={!!notification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 画面の中央に配置
        autoHideDuration={2000} // 自動的に消えるまでの時間（ミリ秒）
        onClose={() => setNotification(null)} // 閉じる処理
        sx={{
          position: 'fixed',
          top: '50vh', // ビューポートの高さの50%を基準にする
          left: '50vw', // ビューポートの幅の50%を基準にする
          transform: 'translate(-50%, -50%)', // 正確な中央に移動
          width: 'fit-content', // 必要に応じて幅を調整
        }}
      >
        <Alert
          severity="success"
          onClose={() => setNotification(null)} // Alert 内で閉じる処理
          sx={{ width: '100%' }}
        >
          {notification}
        </Alert>
      </Snackbar>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.length === 0 && !error ? (
        <p>投稿がありません</p>
      ) : (
        posts.map((post) => (
          <PostItem
            key={post.id}
            post={{
              ...post, id: Number(post.id), author: post.author, created_at: post.created_at
            }}
            // showDeleteButtonがtrueの場合のみonDeleteを渡す
            onDelete={showDeleteButton ? () => handleDelete(post.id) : undefined}
            replies={replies[String(post.id)] || []}
             onAvatarClick={handleAvatarClick
            }          
          
          
        />
        
        ))
      )}
    </div>
  );
};

export default PostList;

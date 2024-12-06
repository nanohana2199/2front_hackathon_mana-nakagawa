import React, { useState, useEffect } from 'react';
import PostItem from './PostItemWithSidebar';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getPosts } from '../api/post';
import { getReplies } from '../api/reply';

interface RepliesMap {
  [postId: string]: any[];
}

type UserMap = {
  [user_id: string]: string; // user_idをキーにprofileImageのURLを保持
};

type Post = {
  id: number;
  content: string;
  author: string;
  user_id: string; }

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // 初期値を空配列
  const [replies, setReplies] = useState<RepliesMap>({}); // 初期値を空オブジェクト
  const [userAvatars, setUserAvatars] = useState<UserMap>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = (await getPosts()) || []; // データが null の場合に備えて空配列を代入
        const sortedPosts = data.sort((a: Post, b: Post) => b.id - a.id);
        setPosts(data);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(`投稿の取得に失敗しました: ${error.message}`);
        }
      }
    };

    fetchPosts();
  }, []);

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

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.length === 0 && !error ? (
        <p>投稿がありません</p>
      ) : (
        posts.map((post) => (
          <PostItem
          key={post.id}
          post={{ ...post, id: Number(post.id),author: post.author}}
          replies={replies[String(post.id)] || []}
          
          
          
        />
        
        ))
      )}
    </div>
  );
};

export default PostList;

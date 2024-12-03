// src/components/PostList.tsx
import React, { useState, useEffect } from 'react';
import PostItem from './PostItemWithSidebar';
import { Post } from '../types';
import { getPosts } from '../api/post'; // getPostsをインポート
import { getReplies } from '../api/reply'; // getRepliesをインポート

interface RepliesMap {
  [postId: string]: any[];  // postIdをキー、リプライの配列を値に持つ
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<RepliesMap>({}); // 各投稿IDごとのリプライを保存
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();  // 投稿の取得
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

  // 投稿が取得された後にリプライを取得
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesData = await Promise.all(
          posts.map(async (post) => {
            const repliesForPost = await getReplies(Number(post.id));
            return { postId: post.id, replies: repliesForPost };
          })
        );
        const repliesMap: RepliesMap = repliesData.reduce((acc: RepliesMap, { postId, replies }) => {
          acc[postId] = replies; // repliesMapにリプライをセット
          return acc;
        }, {} as RepliesMap);  // {} を RepliesMap 型として初期化
        setReplies(repliesMap);
      } catch (error) {
        if (error instanceof Error) {
          setError(`リプライの取得に失敗しました: ${error.message}`);
        }
      }
    };

    if (posts.length > 0) {
      fetchReplies();
    }
  }, [posts]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.length === 0 && !error ? (
        <p>投稿がありません</p>
      ) : (
        posts.map((post) => (
          <PostItem key={post.id} post={post} replies={replies[post.id] || []} />
        ))
      )}
    </div>
  );
};

export default PostList;

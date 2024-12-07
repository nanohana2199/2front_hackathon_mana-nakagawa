import { Post } from '../types/post';

export async function createPost(post: Post) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;

  try {
    // POSTリクエストを送信して、新しい投稿を作成
    const response = await fetch(`${apiBaseURL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`エラー: ${response.status} ${response.statusText} - ${text}`);
      
    }

    const part = await response.json();  // 作成された投稿データを取得
    console.log("part=",part)

    if (part== "yes\n"){
      alert("不適切！")
      console.log("不適切です")
      return;
    }
    

    // POSTが成功した後、GETリクエストを実行して投稿一覧を取得
    const posts = await getPosts();  // getPosts関数を呼び出して投稿一覧を取得
    console.log('取得した投稿データ:', posts);  // 取得した投稿データを表示

    return { posts };  // 作成した投稿と、全ての投稿データを返す
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('予期しないエラーが発生しました');
    }
  }
}

// 新しく追加したGETリクエストのコード
export async function getPosts(userId?: string) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;

  try {
    const url = userId ? `${apiBaseURL}/posts?userId=${userId}` : `${apiBaseURL}/posts`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const text = await response.text();
      console.error('エラー内容:', text);
      throw new Error(`エラー: ${response.status} ${response.statusText}`);
    }

    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('予期しないレスポンス:', text);
      throw new Error(`予期しないレスポンス形式: ${contentType}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('エラーが発生しました:', error.message);
      throw new Error(error.message);
    } else {
      throw new Error('予期しないエラーが発生しました');
    }
  }
}

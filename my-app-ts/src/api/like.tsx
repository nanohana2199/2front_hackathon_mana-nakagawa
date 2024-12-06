export async function likePost(postId: number, userId: string) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;
  

  try {
    console.log('User ID:', userId); // userId が正しい Firebase UID になっているか確認

    const response = await fetch(`${apiBaseURL}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from server:', text); // エラーレスポンスの詳細をログ出力
      throw new Error(`いいねに失敗しました: ${text}`);
    }
    
   
    return response;  // サーバーからのレスポンスを返す
  } catch (error) {
    console.error('いいねのリクエストでエラー:', error);
    throw new Error('いいねに失敗しました');
  }
}

export async function getLikeCount(postId:number) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;

  try {
    const response = await fetch(`${apiBaseURL}/posts/${postId}/like/count`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
  });
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from server:', text); // エラーレスポンスの詳細をログ出力
      throw new Error(`いいね数の取得に失敗しました: ${text}`);
    }

    const data = await response.json(); // いいね数のデータを取得
    return data.count; // いいね数を返す
  } catch (error) {
    console.error('いいね数の取得でエラー:', error);
    throw new Error('いいね数の取得に失敗しました');
  }
}

export async function checkIfLiked(postId: number, userId: string) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;

  try {
    const response = await fetch(`${apiBaseURL}/posts/${postId}/like/status?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from server:', text);
      throw new Error(`いいねステータスの取得に失敗しました: ${text}`);
    }

    const data = await response.json(); // サーバーからのステータスを取得
    return data.liked; // ユーザーがいいねしているかどうかを返す
  } catch (error) {
    console.error('いいねステータスの取得でエラー:', error);
    throw new Error('いいねステータスの取得に失敗しました');
  }
}

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
    //   throw new Error(`エラー: ${response.status} ${response.statusText} - ${text}`);
      
    // }

    if (response.status === 403) {
      // 403 Forbiddenの場合は画像を表示
      displayTemporaryImage('/images/forbidden-image.png'); // 公開フォルダに配置した画像を表示
      return; // 処理を中断
    }

    // その他のエラーは例外としてスロー
    throw new Error(`エラー: ${response.status} ${response.statusText} - ${text}`);
  }

    const part = await response.json();  // 作成された投稿データを取得
    console.log("part=",part)

    // if (part== "yes\n"){
    //   alert("不適切！")
    //   console.log("不適切です")
    //   return;
    // }
    

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

function displayTemporaryImage(imagePath: string) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'black';
  overlay.style.zIndex = '9999';
  
  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = '不適切な投稿に対する通知';
  img.style.position = 'absolute';
  img.style.top = '50%';
  img.style.left = '50%';
  img.style.transform = 'translate(-50%, -50%)';
  img.style.maxHeight = '100vh'; // 縦幅いっぱいに表示
  img.style.maxWidth = '100%'; // 横幅を超えないように調整
  img.style.objectFit = 'contain';
  document.body.appendChild(img);

    // 黒い背景に画像を追加
    overlay.appendChild(img);
    document.body.appendChild(overlay);
  

  // 数秒後に画像を削除
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }, 2500); // 3秒間表示
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


export async function deletePost(postId: number) {
  const apiBaseURL = process.env.REACT_APP_BASE_URL;

  try {
    const response = await fetch(`${apiBaseURL}/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`エラー: ${response.status} ${response.statusText} - ${text}`);
    }

    return true; // 成功時
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('予期しないエラーが発生しました');
    }
  }
}

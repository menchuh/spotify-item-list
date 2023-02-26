/**
 * リフレッシュトークンを初期化する関数。
 * スコープが変わるなどした際に使用する
 */
function initialRefreshToken(): void {
  // 定数
  const TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const redirectUri = 'http://localhost:3000';

  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const CLIENT_ID = props.CLIENT_ID;
  const CLIENT_SECRET = props.CLIENT_SECRET;
  const CODE = props.CODE;

  // 認証情報の生成
  const auth = Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

  // リクエスト
  const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    payload: {
      grant_type: 'authorization_code',
      CODE,
      redirect_uri: redirectUri,
    },
  };
  const response = UrlFetchApp.fetch(TOKEN_URL, params);
  const responseObj = JSON.parse(response.getContentText());

  Logger.log(responseObj);
}

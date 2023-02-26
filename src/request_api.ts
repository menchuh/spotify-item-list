import { TimeRange } from './timeRange';

/**
 * Spotify APIでユーザーのトップアイテムを取得する関数
 * @param accessToken string
 * @param type string
 * @param timeRange string
 * @return data
 */
export function getTopItems(
  accessToken: string,
  type: string,
  timeRange: TimeRange
) {
  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const ITEMS_LIMIT = props.ITEMS_LIMIT;

  if (!(timeRange in TimeRange)) {
    throw new Error(
      `The timeRange value ${timeRange} does not exist in _TimeRange Enum.`
    );
  }

  // リクエスト
  const url = `https://api.spotify.com/v1/me/top/${type}?limit=${ITEMS_LIMIT}&time_range=${timeRange}`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = UrlFetchApp.fetch(url, options);

  const items: Spotify.Track[] = JSON.parse(response.getContentText()).items;
  return items;
}

/**
 * Spotify APIでユーザーのプレイリストのIDを取得する関数
 * @param accessToken string
 * @param data item[]
 * @param url string | undefined
 * @return paylistIds string[]
 */
export function getPlaylistIds(accessToken: string, data: any[], url?: string) {
  // 環境変数の取得
  const props = PropertiesService.getScriptProperties().getProperties();
  const ITEMS_LIMIT = props.ITEMS_LIMIT;

  // リクエスト
  const requestUrl = url
    ? url
    : `https://api.spotify.com/v1/me/playlists?limit=${ITEMS_LIMIT}`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = UrlFetchApp.fetch(requestUrl, options);
  const content = JSON.parse(response.getContentText());

  // ページネーション処理
  data.push(...content.items);
  if (content.next) {
    getPlaylistIds(accessToken, data, content.next);
  }

  const playlistIds: string[] = data
    .filter((d) => {
      return /mench_[0-9]{8}/.test(d.name);
    })
    .map((p) => p.id);
  return playlistIds;
}

/**
 * Spotify APIでプレイリストの情報を取得する関数
 * @param accessToken string
 * @param paylistId string
 * @return paylistTrackData obj[]
 */
export function getPlaylistInfo(accessToken: string, paylistId: string) {
  // リクエスト
  const url = `https://api.spotify.com/v1/playlists/${paylistId}`;
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = UrlFetchApp.fetch(url, options);
  const content = JSON.parse(response.getContentText());

  const { name } = content;
  const tracks = content.tracks.items.map((i: any) => i.track);

  return {
    name,
    tracks: tracks.map((t: any) => {
      return {
        name: t.name,
        artists: t.artists.map((a: any) => a.name).join(','),
      };
    }),
  };
}

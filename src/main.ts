import { getAccessToken } from './auth';
import { EntityType } from './entityType';
import { TimeRange } from './timeRange';
import { getTopItems, getPlaylistInfo, getPlaylistIds } from './request_api';
import { saveTopDataToSheet, saveTrackDataToSheet } from './edit_sheet';

/**
 * メイン関数
 */
function main(): void {
  // 定数
  const TIME_RANGE = TimeRange.medium_term;

  // アクセストークンの取得
  const accessToken = getAccessToken();

  // データの取得
  const artistsData: SpotifyApi.ArtistObjectFull[] = getTopItems(
    accessToken,
    EntityType.artists,
    TIME_RANGE
  );
  const tracksData: SpotifyApi.TrackObjectFull[] = getTopItems(
    accessToken,
    EntityType.tracks,
    TIME_RANGE
  );

  // スプレッドシートへの書き込み
  saveTopDataToSheet(artistsData, EntityType.artists);
  saveTopDataToSheet(tracksData, EntityType.tracks);
}

/**
 * プレイリストに使用した楽曲一覧を作成する関数
 */
function listAddedTracks(): void {
  // アクセストークンの取得
  const accessToken = getAccessToken();

  // プレイリストIDの配列を取得
  const playlistIds = getPlaylistIds(accessToken, []);

  // プレイリストの情報を取得
  const data = playlistIds.map((id) => getPlaylistInfo(accessToken, id));

  // スプレッドシートへの書き込み
  saveTrackDataToSheet(data);
}

global.main = main;
global.listAddedTracks = listAddedTracks;

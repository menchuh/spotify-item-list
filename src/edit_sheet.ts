import { EntityType } from './entityType';

// 定数
const START_ROW_NUM = 2;
const START_COLUMN_NUM = 1;

/**
 * 個人のトップのデータをシートに書き込むための関数
 * @param data Track[]
 * @param entityType EntityType
 */
export function saveTopDataToSheet(
  data: SpotifyApi.ArtistObjectFull[] | SpotifyApi.TrackObjectFull[],
  entityType: EntityType
): void {
  // 変数の宣言
  let values;
  // データを書き込むための二次元配列を生成
  if (entityType === EntityType.artists) {
    values = _createArtistsValues(data);
  } else if (entityType === EntityType.tracks) {
    values = _createTracksValues(data);
  } else {
    throw new Error('unexpected entity type');
  }

  // データを書き込む範囲を指定
  const FINISH_ROW_NUM = values.length;
  const FINISH_COLUMN_NUM = values[0].length;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    EntityType[entityType]
  );
  if (!sheet) {
    throw Error(`The sheet ${EntityType[entityType]} is not exits.`);
  }
  const range = sheet.getRange(
    START_ROW_NUM,
    START_COLUMN_NUM,
    FINISH_ROW_NUM,
    FINISH_COLUMN_NUM
  );

  // データの書き込み
  range.setValues(values);
}

/**
 * プレイリストに追加されたトラックのデータをシートに書き込むための関数
 * @param data
 */
export function saveTrackDataToSheet(data: any): void {
  // 定数
  const SHEET_NAME = 'mylist_tracks';

  // データを書き込むための二次元配列を生成
  const values = _createPlaylistTrackValues(data);

  // データを書き込む範囲を指定
  const FINISH_ROW_NUM = values.length;
  const FINISH_COLUMN_NUM = values[0].length;
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw Error(`The sheet ${SHEET_NAME} is not exits.`);
  }
  const range = sheet.getRange(
    START_ROW_NUM,
    START_COLUMN_NUM,
    FINISH_ROW_NUM,
    FINISH_COLUMN_NUM
  );

  // データの書き込み
  range.setValues(values);
}

/**
 * アーティストの二次元配列を生成する関数
 * @param data
 * @reaturn values
 */
function _createArtistsValues(data: any[]): string[][] {
  const values = data.map(
    (elm: SpotifyApi.ArtistObjectFull, i: number): string[] => {
      return [
        String(i + 1),
        elm.id,
        elm.name,
        elm.genres.join(','),
        String(elm.popularity),
        String(elm.followers.total),
      ];
    }
  );
  return values;
}

/**
 * トラックの二次元配列を生成する関数
 * @param data
 * @reaturn values
 */
function _createTracksValues(data: any[]): string[][] {
  const values = data.map(
    (elm: SpotifyApi.TrackObjectFull, i: number): string[] => {
      return [
        String(i + 1),
        elm.id,
        elm.name,
        elm.artists.map((a: any) => a.name).join(','),
        String(elm.popularity),
        `${Math.floor(elm.duration_ms / 1000 / 60) % 60}:${String(
          Math.floor(elm.duration_ms / 1000) % 60
        ).padStart(2, '0')}`,
      ];
    }
  );
  return values;
}

/**
 * プレイリストに追加されているトラックの二次元配列を生成する関数
 * @param data
 * @reaturn values
 */
function _createPlaylistTrackValues(data: any): string[][] {
  let id = 0;
  const nestedValues = data.map((playlist: any) => {
    return playlist.tracks.map((track: SpotifyApi.TrackObjectFull) => {
      id++;
      return [id, playlist.name, track.name, track.artists];
    });
  });
  const values = [].concat(...nestedValues);
  return values;
}

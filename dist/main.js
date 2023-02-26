function main() {
}
function listAddedTracks() {
}/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/auth.ts":
/*!*********************!*\
  !*** ./src/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAccessToken": () => (/* binding */ getAccessToken)
/* harmony export */ });
/**
 * アクセストークンを取得する
 * @return accessToken string
 */
function getAccessToken() {
    // 定数
    const TOKEN_URL = 'https://accounts.spotify.com/api/token';
    // 環境変数の取得
    const props = PropertiesService.getScriptProperties().getProperties();
    const CLIENT_ID = props.CLIENT_ID;
    const CLIENT_SECRET = props.CLIENT_SECRET;
    const REFRESH_TOKEN = props.REFRESH_TOKEN;
    // 認証情報の生成
    const auth = Utilities.base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`);
    // リクエスト
    const options = {
        method: 'post',
        headers: {
            Authorization: `Basic ${auth}`,
        },
        payload: {
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
        },
    };
    const response = UrlFetchApp.fetch(TOKEN_URL, options);
    const data = JSON.parse(response.getContentText());
    return data.access_token;
}


/***/ }),

/***/ "./src/edit_sheet.ts":
/*!***************************!*\
  !*** ./src/edit_sheet.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "saveTopDataToSheet": () => (/* binding */ saveTopDataToSheet),
/* harmony export */   "saveTrackDataToSheet": () => (/* binding */ saveTrackDataToSheet)
/* harmony export */ });
/* harmony import */ var _entityType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entityType */ "./src/entityType.ts");

// 定数
const START_ROW_NUM = 2;
const START_COLUMN_NUM = 1;
/**
 * 個人のトップのデータをシートに書き込むための関数
 * @param data Track[]
 * @param entityType EntityType
 */
function saveTopDataToSheet(data, entityType) {
    // 変数の宣言
    let values;
    // データを書き込むための二次元配列を生成
    if (entityType === _entityType__WEBPACK_IMPORTED_MODULE_0__.EntityType.artists) {
        values = _createArtistsValues(data);
    }
    else if (entityType === _entityType__WEBPACK_IMPORTED_MODULE_0__.EntityType.tracks) {
        values = _createTracksValues(data);
    }
    else {
        throw new Error('unexpected entity type');
    }
    // データを書き込む範囲を指定
    const FINISH_ROW_NUM = values.length;
    const FINISH_COLUMN_NUM = values[0].length;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(_entityType__WEBPACK_IMPORTED_MODULE_0__.EntityType[entityType]);
    if (!sheet) {
        throw Error(`The sheet ${_entityType__WEBPACK_IMPORTED_MODULE_0__.EntityType[entityType]} is not exits.`);
    }
    const range = sheet.getRange(START_ROW_NUM, START_COLUMN_NUM, FINISH_ROW_NUM, FINISH_COLUMN_NUM);
    // データの書き込み
    range.setValues(values);
}
/**
 * プレイリストに追加されたトラックのデータをシートに書き込むための関数
 * @param data
 */
function saveTrackDataToSheet(data) {
    // 定数
    const SHEET_NAME = 'mylist_tracks';
    // データを書き込むための二次元配列を生成
    const values = _createPlaylistTrackValues(data);
    // データを書き込む範囲を指定
    const FINISH_ROW_NUM = values.length;
    const FINISH_COLUMN_NUM = values[0].length;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
        throw Error(`The sheet ${SHEET_NAME} is not exits.`);
    }
    const range = sheet.getRange(START_ROW_NUM, START_COLUMN_NUM, FINISH_ROW_NUM, FINISH_COLUMN_NUM);
    // データの書き込み
    range.setValues(values);
}
/**
 * アーティストの二次元配列を生成する関数
 * @param data
 * @reaturn values
 */
function _createArtistsValues(data) {
    const values = data.map((elm, i) => {
        return [
            i + 1,
            elm.id,
            elm.name,
            elm.genres.join(','),
            elm.popularity,
            elm.followers.total,
        ];
    });
    return values;
}
/**
 * トラックの二次元配列を生成する関数
 * @param data
 * @reaturn values
 */
function _createTracksValues(data) {
    const values = data.map((elm, i) => {
        return [
            i + 1,
            elm.id,
            elm.name,
            elm.artists.map((a) => a.name).join(','),
            elm.popularity,
            `${Math.floor(elm.duration_ms / 1000 / 60) % 60}:${String(Math.floor(elm.duration_ms / 1000) % 60).padStart(2, '0')}`,
        ];
    });
    return values;
}
/**
 * プレイリストに追加されているトラックの二次元配列を生成する関数
 * @param data
 * @reaturn values
 */
function _createPlaylistTrackValues(data) {
    let id = 0;
    const nestedValues = data.map((playlist) => {
        return playlist.tracks.map((track) => {
            id++;
            return [id, playlist.name, track.name, track.artists];
        });
    });
    const values = [].concat(...nestedValues);
    return values;
}


/***/ }),

/***/ "./src/entityType.ts":
/*!***************************!*\
  !*** ./src/entityType.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntityType": () => (/* binding */ EntityType)
/* harmony export */ });
var EntityType;
(function (EntityType) {
    EntityType["artists"] = "artists";
    EntityType["tracks"] = "tracks";
})(EntityType || (EntityType = {}));


/***/ }),

/***/ "./src/request_api.ts":
/*!****************************!*\
  !*** ./src/request_api.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPlaylistIds": () => (/* binding */ getPlaylistIds),
/* harmony export */   "getPlaylistInfo": () => (/* binding */ getPlaylistInfo),
/* harmony export */   "getTopItems": () => (/* binding */ getTopItems)
/* harmony export */ });
/* harmony import */ var _timeRange__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timeRange */ "./src/timeRange.ts");

/**
 * Spotify APIでユーザーのトップアイテムを取得する関数
 * @param accessToken string
 * @param type string
 * @param timeRange string
 * @return data
 */
function getTopItems(accessToken, type, timeRange) {
    // 環境変数の取得
    const props = PropertiesService.getScriptProperties().getProperties();
    const ITEMS_LIMIT = props.ITEMS_LIMIT;
    if (!(timeRange in _timeRange__WEBPACK_IMPORTED_MODULE_0__.TimeRange)) {
        throw new Error(`The timeRange value ${timeRange} does not exist in _TimeRange Enum.`);
    }
    // リクエスト
    const url = `https://api.spotify.com/v1/me/top/${type}?limit=${ITEMS_LIMIT}&time_range=${timeRange}`;
    const options = {
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const response = UrlFetchApp.fetch(url, options);
    const items = JSON.parse(response.getContentText()).items;
    return items;
}
/**
 * Spotify APIでユーザーのプレイリストのIDを取得する関数
 * @param accessToken string
 * @param data item[]
 * @param url string | undefined
 * @return paylistIds string[]
 */
function getPlaylistIds(accessToken, data, url) {
    // 環境変数の取得
    const props = PropertiesService.getScriptProperties().getProperties();
    const ITEMS_LIMIT = props.ITEMS_LIMIT;
    // リクエスト
    const requestUrl = url
        ? url
        : `https://api.spotify.com/v1/me/playlists?limit=${ITEMS_LIMIT}`;
    const options = {
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
    const playlistIds = data
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
function getPlaylistInfo(accessToken, paylistId) {
    // リクエスト
    const url = `https://api.spotify.com/v1/playlists/${paylistId}`;
    const options = {
        method: 'get',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    const response = UrlFetchApp.fetch(url, options);
    const content = JSON.parse(response.getContentText());
    const { name } = content;
    const tracks = content.tracks.items.map((i) => i.track);
    return {
        name,
        tracks: tracks.map((t) => {
            return {
                name: t.name,
                artists: t.artists.map((a) => a.name).join(','),
            };
        }),
    };
}


/***/ }),

/***/ "./src/timeRange.ts":
/*!**************************!*\
  !*** ./src/timeRange.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeRange": () => (/* binding */ TimeRange)
/* harmony export */ });
var TimeRange;
(function (TimeRange) {
    TimeRange["short_term"] = "short_term";
    TimeRange["medium_term"] = "medium_term";
    TimeRange["long_term"] = "long_term";
})(TimeRange || (TimeRange = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth */ "./src/auth.ts");
/* harmony import */ var _entityType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./entityType */ "./src/entityType.ts");
/* harmony import */ var _timeRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./timeRange */ "./src/timeRange.ts");
/* harmony import */ var _request_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./request_api */ "./src/request_api.ts");
/* harmony import */ var _edit_sheet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit_sheet */ "./src/edit_sheet.ts");





/**
 * メイン関数
 */
function main() {
    // 定数
    const TIME_RANGE = _timeRange__WEBPACK_IMPORTED_MODULE_2__.TimeRange.medium_term;
    // アクセストークンの取得
    const accessToken = (0,_auth__WEBPACK_IMPORTED_MODULE_0__.getAccessToken)();
    // データの取得
    const artistsData = (0,_request_api__WEBPACK_IMPORTED_MODULE_3__.getTopItems)(accessToken, _entityType__WEBPACK_IMPORTED_MODULE_1__.EntityType.artists, TIME_RANGE);
    const tracksData = (0,_request_api__WEBPACK_IMPORTED_MODULE_3__.getTopItems)(accessToken, _entityType__WEBPACK_IMPORTED_MODULE_1__.EntityType.tracks, TIME_RANGE);
    // スプレッドシートへの書き込み
    (0,_edit_sheet__WEBPACK_IMPORTED_MODULE_4__.saveTopDataToSheet)(artistsData, _entityType__WEBPACK_IMPORTED_MODULE_1__.EntityType.artists);
    (0,_edit_sheet__WEBPACK_IMPORTED_MODULE_4__.saveTopDataToSheet)(tracksData, _entityType__WEBPACK_IMPORTED_MODULE_1__.EntityType.tracks);
}
/**
 * プレイリストに使用した楽曲一覧を作成する関数
 */
function listAddedTracks() {
    // アクセストークンの取得
    const accessToken = (0,_auth__WEBPACK_IMPORTED_MODULE_0__.getAccessToken)();
    // プレイリストIDの配列を取得
    const playlistIds = (0,_request_api__WEBPACK_IMPORTED_MODULE_3__.getPlaylistIds)(accessToken, []);
    // プレイリストの情報を取得
    const data = playlistIds.map((id) => (0,_request_api__WEBPACK_IMPORTED_MODULE_3__.getPlaylistInfo)(accessToken, id));
    // スプレッドシートへの書き込み
    (0,_edit_sheet__WEBPACK_IMPORTED_MODULE_4__.saveTrackDataToSheet)(data);
}
__webpack_require__.g.main = main;
__webpack_require__.g.listAddedTracks = listAddedTracks;

})();

/******/ })()
;
# D｜Web–LINE 連結與個人通知

**一句話目標：**讓使用者能連結網站與 LINE 官方帳號、設定通知偏好，並只把符合條件的核對更新送到同意接收的指定測試帳號。

## 負責 Issues

- [#5 實作 LINE 帳號連結與 Webhook 驗證](https://github.com/yang-yang1211/law_tec/issues/5)
- [#6 實作個人化 LINE API 通知](https://github.com/yang-yang1211/law_tec/issues/6)

## 工作邊界與依賴

- C 提供共用 NewsItem；D 讀取其狀態和來源，不自行撰寫或推論法律內容。
- A 確認伺服器執行環境、Webhook 對外網址和受控測試帳號。
- LINE 憑證只放伺服器環境變數；不放前端、Issue、截圖或 Git。
- 沒有可用的 LINE 測試環境時先用 mock，並清楚標示尚未實際串接。

## Issue #5：帳號連結與 Webhook

1. 在 `server/line/account-link.js` 實作一次性 link token／nonce、成功連結、錯誤處理和解除連結。
2. 網站顯示未連結／已連結狀態；失敗或無效 nonce 不得建立帳號對應。
3. 在 `server/line/webhook.js` 接收事件；以原始 request body 驗證簽章，簽章錯誤時拒絕處理，依 `webhookEventId` 去重。
4. 在 `.env.example` 列變數名稱，不填真實憑證。
5. 記錄連結、解除、無效 nonce、錯誤簽章和重送事件的測試步驟與結果。

## Issue #6：通知偏好與個人推播

1. 在 `prototype/line-settings.js` 提供通知開關、議題／身分偏好、同意狀態和解除連結操作；由 A 在整合時接入主畫面。
2. 在 `server/line/notifications.js` 實作條件判斷、訊息格式和 Push API 呼叫。
3. 只有帳號已連結、明確同意、通知開啟、標籤匹配，且 NewsItem 為 `verificationStatus=verified` 和 `notificationLevel=important` 時才送出。
4. 訊息包含簡短摘要、資料中的法律／議事狀態、更新時間和官方來源連結。
5. 推播只送到 #6 明列的單一測試 user ID；不得用群發 API。
6. 記錄符合條件時送達、未同意／停用／解除／不匹配／待核時不送，以及 Webhook 重送或 API 失敗時不重複發送。
7. 若測試環境未備妥，使用 mock，列明缺少條件，不可稱為 API 實測。

## 主要交付檔案

- `server/line/account-link.js`
- `server/line/webhook.js`
- `server/line/notifications.js`
- `prototype/line-settings.js`
- `.env.example`（只含變數名稱和空白示意值）

## 完成條件

- 使用者可重現連結、解除及偏好設定；無效簽章、nonce、重複事件沒有副作用。
- 只有符合資格的更新會傳到指定測試帳號；不符合條件時不呼叫 Push。
- LINE 訊息含可回查官方來源，且狀態照資料顯示、不由 D 改寫。
- #5、#6 記有成功和失敗情境；未實測部分標示為模擬。

## 交接

- 向 A 提供設定介面、伺服器端 API、環境變數名稱和測試結果。
- 使用 C 核對好的資料；與 A 確認測試帳號和環境。
- E 抽查連結失敗、重送事件和未同意不通知等高風險情境。

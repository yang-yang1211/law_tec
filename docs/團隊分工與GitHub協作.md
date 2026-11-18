# 團隊分工與 GitHub 協作

> 成員代號為 A–E。P-01 至 P-10 已建立為本 repository 的 GitHub Issues；目前尚未指定隊友帳號，GitHub Projects 看板尚未建立。實際進度以 Issues 任務列表為準。

## A–E 分工

| 代號 | 主責 | 主要交付 | 協作與介面 |
|---|---|---|---|
| A |  需求統整、共用資料契約、模組整合、排程、計畫書與簡報 | MVP 端到端版本；計畫書；整合與決策紀錄 | 確認資料欄位、處理跨模組依賴、Review 整合 PR |
| B | 首頁推薦排序與 feed 介面 | 可重現的排序函式；推薦／追蹤／最新三種檢視；推薦理由與空狀態 | 讀取資料契約 v1.0.0；不負責來源核對、問答或 LINE 推播 |
| C | 官方法訊來源核對與引用式問答（#3、#4） | 至少 6 筆逐筆核對的共用 NewsItem；問答模組；20 題測試案例 | 將 verified fixture 交 B、D；將 qa.js 介面交 A 整合；E 抽查資料與答覆 |
| D | Web–LINE 帳號連結、通知偏好與個人推播（#5、#6） | 帳號連結／解除、Webhook 驗證、偏好設定、單一測試帳號推播 | 使用 C 的 verified NewsItem；與 A 確認伺服器環境和測試帳號；只做有同意的個人推播 |
| E |  示例資料核對、手動驗收、Demo 腳本、會議記錄、簡報素材 | 驗收清單；展示腳本；截圖；待修清單；提交前文件檢查 | 將問題開成 Issue 並連結負責成員；更新可重現步驟 |

## B 要實際完成的工作（Issue #2）

**一句話目標：**把目前首頁原型的法訊列表改成「使用者選了哪些關注標籤，就依一套看得懂的規則排列內容」，並在每張卡片說明為什麼出現。

**B 負責的範圍：**推薦排序和首頁 feed 的顯示。C 負責核對資料與法律狀態；B 不爬資料、不判斷法規是否生效、不做聊天機器人或 LINE 推播。

**輸入資料：**
- 使用者偏好：profile 的 topicTags、audienceTags。
- 法訊清單：符合 [資料契約 v1.0.0](https://github.com/yang-yang1211/law_tec/blob/docs/team-workplan-kickoff/docs/資料契約.md) 的 NewsItem[]；正式資料來自 data/fixtures/news-items.v1.json。
- C 尚未提供足夠核對資料時，B 可在自己的分支暫用清楚標成「示意／待核」的測試項目；不能把測試項目寫進共用 fixture 當成真實法訊。

**程式工作：**
1. 在 prototype/recommendation.js 寫 rankNewsItems(items, profile, now)，回傳排序後項目、分數和命中的推薦理由；讓同一輸入每次得到同一結果。
2. 在 prototype/index.html 接上函式，完成下面三個檢視與卡片呈現。
3. 在 docs/推薦排序規則.md 記錄公式、三筆計算例子和已知限制。
4. PR 附截圖、啟動方式、至少兩個驗收情境及結果。

**首頁排序 v1 規則：**
- topicTags 至少命中一個使用者關注議題：+40 分；不重複累加。
- audienceTags 至少命中一個使用者身分：+30 分；不重複累加。
- 資料新近度：updatedAt 優先，缺少時用 publishedAt；7 日內 +20，8–30 日 +10，超過 30 日或日期未知 +0。
- notificationLevel=important 且 verificationStatus=verified：+10；其他情況 +0。
- 依總分由高到低；同分依有效更新時間新到舊，再依 id 排序，確保結果穩定。
- 「為你推薦」前 5 則避免連續 3 則同一主題；若可選項目分數差超過 10 分，就保留原分數順序。
- 法案狀態不參與分數；直接顯示資料中的 billStage、legalEffect 或 sourceStatusText，不自行改寫。

**三種檢視怎麼做：**
- 為你推薦：使用上述分數排序；每則卡片列出實際命中的理由，例如「符合租屋權益」「更新於近 7 日」。
- 我追蹤的：只保留 topicTags 或 audienceTags 與使用者偏好至少一項相符的資料，再依有效更新時間排序。
- 最新消息：不做個人化分數，依 updatedAt／publishedAt 新到舊排序；沒有日期的項目排最後。
- 搜尋：在目前檢視中比對標題、摘要和標籤；無結果或沒有追蹤項目時顯示空狀態。

**卡片至少顯示：** title、summary、來源名稱與連結、資料時間、來源狀態／法案狀態、推薦理由。verificationStatus=pending 或 source.url 為空時，明顯標「示意／待核」，不能看起來像已核對的真實法訊。

**完成條件：**
- 輸入相同時，分數與排序穩定；推薦理由能對應分數項目。
- 有標籤匹配的資料排在無匹配但較新的資料之前；「我追蹤的」不含無匹配項目；「最新消息」依日期排序。
- 搜尋無結果、追蹤清單為空、日期缺漏時都能正常顯示。
- 窄螢幕仍可讀；法律狀態和來源內容沒有由 B 自行編造。
- B 在 #2 留下排序例子和至少兩個驗收結果，讓 A、E 能重現。

## C 要實際完成的工作（Issues #3、#4）

**一句話目標：**先把少量官方法訊逐筆查清楚，再做一個只引用已核對資料、沒有依據就明確拒答的問答模組。

**C 負責的範圍：**官方資料來源、摘要和法律／議事狀態的正確性，以及引用式問答。C 不負責首頁推薦排序（B）或 LINE 帳號連結與推播（D）。

**輸入資料：**
- 使用 [NewsItem 資料契約 v1.0.0](https://github.com/yang-yang1211/law_tec/blob/docs/team-workplan-kickoff/docs/資料契約.md) 和唯一共用資料 `data/fixtures/news-items.v1.json`。
- 來源限立法院、全國法規資料庫等可回查的官方網站；欄位缺漏、來源衝突或狀態不明時保留未知並標待核。

**Issue #3：整理並核對資料**
1. 在 `data/fixtures/news-items.v1.json` 維護至少 6 筆租屋或勞動議題的 NewsItem。
2. 每筆要能回到官方文件，填來源 URL、文件名稱、查核日期、段落／條文定位和支持摘要的原文摘錄；只有逐筆核對完成才能標 `verified`。
3. 在 `docs/來源查核紀錄.md` 記錄使用的官方資料集、更新頻率／限制、每筆資料的核對結果，以及未解決問題。
4. 請 E 抽查至少 2 筆；C 修正問題並在 #3 記錄依據。

**Issue #4：做有引用和拒答的問答**
1. 在 `prototype/qa.js` 實作 `answerQuestion(question, items)`，只檢索 `verificationStatus=verified` 且有可回查來源的資料。
2. 回傳格式固定包含 `status`（`answered` 或 `insufficient_evidence`）、`answer`、`references`、`billStage`、`legalEffect`。引用至少帶資料標題、官方 URL 和可定位段落；不把立法院進度推論成法律生效。
3. 沒有符合資料、來源相互矛盾、狀態未知或問題要求個案法律判斷時，回傳明確拒答和可查原始來源的提示；不得補猜答案。
4. 在 `docs/問答測試案例.md` 寫至少 20 題，列出預期回答／拒答、依據資料 ID 和引用；至少手動記錄 5 題實際結果，涵蓋有依據的回答及不同拒答原因。
5. C 交付問答函式和測試案例給 A，由 A 在整合任務接上聊天介面；避免和 B 同時改首頁檔案。

**完成條件：**
- 6 筆共用資料的來源和狀態可逐筆重現；E 抽查問題已有處理結果。
- 問答每項事實都能對應到回傳引用；沒有足夠證據時拒答。
- 測試記錄清楚列出問題、預期結果、實際結果和來源，不只寫「測試通過」。
- C 在 #3、#4 留下交付路徑和已知限制，讓 A、B、D 可直接串接。

## D 要實際完成的工作（Issues #5、#6）

**一句話目標：**讓使用者能把網站帳號連到 LINE 官方帳號並設定偏好，然後只把符合條件的已核對更新傳給同意接收的指定測試帳號。

**D 負責的範圍：**網站與 LINE 的連結／解除、通知同意與偏好、Webhook 安全處理及單一使用者推播。C 負責法訊來源和法律狀態；D 只能讀取 C 核對好的資料，不自行補寫或推論法律內容。

**輸入與交接：**
- 使用者網站登入狀態、LINE 連結狀態、通知同意及 topicTags／audienceTags 偏好。
- C 提供的共用 NewsItem。可通知項目必須是 `verificationStatus=verified`、`notificationLevel=important)，且符合使用者偏好與同意狀態。
- A 確認伺服器執行環境、Webhook 對外網址和受控測試帳號；LINE 憑證只放伺服器環境變數。

**Issue #5：帳號連結和 Webhook**
1. 在 `server/line/account-link.js` 實作一次性 link token／nonce 流程、成功連結、錯誤處理及解除連結；網站顯示未連結／已連結狀態。
2. 在 `server/line/webhook.js` 接收 LINE Webhook；保留原始 request body 驗證簽章，簽章錯誤時不處理，依 `webhookEventId` 去重。
3. 在 `.env.example` 列出必要變數名稱但不填真實值；不得把 channel secret、access token 或測試者個資提交到 Git。
4. 把測試步驟、連結／解除結果、無效 nonce、錯誤簽章及重送事件結果記在 #5。

**Issue #6：通知偏好和個人推播**
1. 在 `prototype/line-settings.js` 做通知開關、議題／身分偏好、同意狀態和解除連結操作；由 A 在整合時接入主畫面。
2. 在 `server/line/notifications.js` 實作通知條件判斷、訊息格式和 Push API 呼叫。訊息須有摘要、原始法律／議事狀態、更新時間及官方來源連結。
3. 只有已連結、明確同意、通知未停用、標籤匹配，且資料已核對並標為重要時才送出；推播只允許送到 Issue #6 明列的單一測試 user ID，不使用群發 API。
4. 至少記錄三組結果：符合條件時送達指定測試帳號；未同意／停用／解除／標籤不符／待核資料時不送；Webhook 重送或 API 失敗時不重複發送。
5. LINE 測試環境未備妥時改用 mock，清楚標示「模擬」，列出缺少條件，不得宣稱已實際串接。

**完成條件：**
- 帳號連結、解除和通知偏好均可重現；無效簽章、nonce 或重複事件沒有副作用。
- 通知條件可逐項說明，通過與未通過的情境都有記錄。
- 實際推播只能到指定測試帳號，並附可回查官方來源；未同意或資料未核對時不送。
- D 在 #5、#6 留下檔案路徑、測試結果與未完成的環境依賴；A 負責把介面接進整合版。

## 共用資料契約

跨模組使用 [NewsItem 資料契約 v1.0.0](https://github.com/yang-yang1211/law_tec/blob/docs/team-workplan-kickoff/docs/資料契約.md)，唯一共用 fixture 為 `data/fixtures/news-items.v1.json`。欄位、狀態、日期與核對規則以契約文件為準；本文件不重複貼欄位範例，以免出現不同版本。新增欄位前先提出並由 A 確認。

##  GitHub Issues 

| ID | Issue 標題 | 負責角色 | 依賴／完成條件 |
|---|---|---|---|
| P-01 | 定義 MVP 使用者情境與共用 NewsItem schema | A | 五人確認首版標籤、狀態、來源欄位 |
| P-02 | 實作個人化首頁排序與推薦說明 | B | 讀取共用 NewsItem；按已記錄公式排序；三種檢視、推薦理由、搜尋與空狀態可操作 |
| P-03 | 整理立法院與法規示例資料並核對來源 | C（E 抽查） | 共用 fixture 至少 6 筆 verified NewsItem；附官方來源與查核紀錄；E 抽查至少 2 筆並處理問題 |
| P-04 | 建立引用來源的法律問答與拒答流程 | C | qa.js 只用可回查的 verified 資料；20 題測試案例；無依據、衝突、未知或個案問題明確拒答 |
| P-05 | 實作 Web–LINE 帳號連結與 Webhook 驗證 | D | 一次性 nonce、連結／解除、原始 body 簽章驗證與 webhookEventId 去重可重現 |
| P-06 | 實作個人化 LINE API 通知 | D | 只對已連結、同意、偏好匹配且 verified/important 的資料推播至指定單一測試帳號；未符合時不送 |
| P-07 | 整合首頁 → 法訊 → 問答 → LINE Demo | A（B、C、D 支援串接） | 五人可照腳本重現主要流程 |
| P-08 | 建立問答與首頁手動驗收清單 | E | 覆蓋引用、狀態區分、無資料時的處理 |
| P-09 | 撰寫兩分鐘 Pitch 與 Demo 腳本 | A（E 協助） | 問題、使用者、AI 角色、社會影響、展示流順暢 |
| P-10 | 整理初賽書面資料與提交前檢查 | A（E 協助） | 確認簡章要求、連結可開啟、檔案可播放 |

## 分支、PR 與 Review

1. `main` 保持可展示；不要直接推送到 `main`。
2. 一張 Issue 對應一個分支，例如 `feat/p-02-personal-feed`。
3. 表格中的 `P-01` 等是建立 Issue 前的暫用代號；建立 GitHub Issue 後，以 GitHub 指派的數字編號為準。PR 標題含該數字編號，描述用 `Closes #<數字>` 連回 Issue。
4. PR 至少附上：改動摘要、畫面截圖或 Demo 步驟、驗收結果、資料來源、已知限制。
5. 主要負責成員之外至少一人 Review；跨模組 PR 由 A 確認整合介面。
6. 合併後由負責人把 Project 狀態改為 `Done`，並在 Issue 註明驗收結果。
7. API 金鑰、LINE channel secret/token、個人資料或測試帳號密碼不得提交到 GitHub；使用本機環境設定並提交不含秘密的 `.env.example`。

## 每日非同步同步

每位成員在自己負責的 Issue 留三行短更新：

```text
昨天完成：
今天要完成：
卡住／需要誰協助：
```

遇到阻塞直接標記 `Blocked` 並@相關負責角色。



export const NAV_ITEMS = [
  { id: "home", label: "首頁總覽", symbol: "⌂" },
  { id: "legislature", label: "議事追蹤", symbol: "▦" },
  { id: "ask", label: "問答工作區", symbol: "◇" },
  { id: "saved", label: "收藏項目", symbol: "☆" },
  { id: "notifications", label: "通知中心", symbol: "♧" },
  { id: "settings", label: "個人設定", symbol: "⚙" },
];

export const PAGES = {
  home: {
    title: "首頁總覽",
    description: "首頁版面與個人化資訊模組。",
    modules: [
      { title: "個人化摘要", layout: "wide", type: "rows" },
      { title: "主要資訊流", layout: "wide", type: "list" },
      { title: "延伸模組", layout: "normal", type: "block" },
    ],
  },
  legislature: {
    title: "議事追蹤",
    description: "議題、會議與進度的瀏覽區。",
    modules: [
      { title: "追蹤條件", layout: "normal", type: "rows" },
      { title: "進度摘要", layout: "normal", type: "block" },
      { title: "議事資料列表", layout: "wide", type: "list" },
    ],
  },
  ask: {
    title: "問答工作區",
    description: "對話區、來源區與輸入控制項。",
    modules: [
      { title: "對話紀錄區", layout: "wide", type: "conversation" },
      { title: "輸入與操作區", layout: "wide", type: "input" },
    ],
  },
  saved: {
    title: "收藏項目",
    description: "已收藏內容的列表與篩選區。",
    modules: [
      { title: "分類與篩選", layout: "normal", type: "rows" },
      { title: "收藏列表", layout: "wide", type: "list" },
    ],
  },
  notifications: {
    title: "通知中心",
    description: "通知列表與狀態檢視區。",
    modules: [
      { title: "通知控制項", layout: "normal", type: "rows" },
      { title: "通知列表", layout: "wide", type: "list" },
    ],
  },
  settings: {
    title: "個人設定",
    description: "帳號、關注項目與通知偏好設定區。",
    modules: [
      { title: "帳號資料", layout: "normal", type: "rows" },
      { title: "關注項目", layout: "normal", type: "rows" },
      { title: "通知偏好", layout: "wide", type: "block" },
    ],
  },
};

export const RAIL_MODULES = ["個人摘要", "快速入口", "輔助資訊"];
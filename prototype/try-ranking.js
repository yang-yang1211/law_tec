// prototype/try-ranking.js
// 執行：node prototype/try-ranking.js
const R = require("./recommendation.js");

const NOW = "2026-11-27T12:00:00+08:00";
const profile = { topicTags: ["租屋權益", "學生打工"], audienceTags: ["租屋族", "學生"] };

// 虛構測試資料，只用來檢查排序
const items = [
  { id: "r1", title: "示意 A", summary: "", topicTags: ["租屋權益"], audienceTags: ["租屋族"], updatedAt: "2026-11-26T10:00:00+08:00", publishedAt: null, notificationLevel: "none", verificationStatus: "pending", source: { url: null } },
  { id: "r2", title: "示意 B", summary: "", topicTags: ["租屋權益"], audienceTags: ["租屋族"], updatedAt: "2026-11-25T10:00:00+08:00", publishedAt: null, notificationLevel: "none", verificationStatus: "pending", source: { url: null } },
  { id: "r3", title: "示意 C", summary: "", topicTags: ["租屋權益"], audienceTags: ["租屋族"], updatedAt: "2026-11-24T10:00:00+08:00", publishedAt: null, notificationLevel: "none", verificationStatus: "pending", source: { url: null } },
  { id: "w1", title: "示意 D", summary: "", topicTags: ["學生打工"], audienceTags: ["學生"], updatedAt: null, publishedAt: "2026-11-10T10:00:00+08:00", notificationLevel: "none", verificationStatus: "pending", source: { url: null } },
  { id: "x1", title: "示意 E", summary: "", topicTags: ["勞動保障"], audienceTags: [], updatedAt: null, publishedAt: null, notificationLevel: "none", verificationStatus: "pending", source: { url: null } },
];

console.log("【為你推薦】");
R.rankNewsItems(items, profile, NOW).forEach(e => console.log(e.item.id, e.score, e.reasons.join(" / ")));

console.log("\n【我追蹤的】", R.followingNewsItems(items, profile).map(i => i.id).join(", "));
console.log("【最新消息】", R.latestNewsItems(items).map(i => i.id).join(", "));
console.log("【搜尋「不存在」】", items.filter(i => R.matchesQuery(i, "不存在")).length, "筆");
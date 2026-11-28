// prototype/recommendation.js
// 法訊雷達｜個人化首頁排序（Issue #2，排序規則 v1）
// 只做計算，不碰畫面；相同輸入一定得到相同結果。

const DAY_MS = 24 * 60 * 60 * 1000; // 一天的毫秒數

// ---------- 小工具 ----------

// 找出「法訊標籤」和「使用者標籤」中相同的部分
function matchTags(itemTags, profileTags) {
  return (itemTags || []).filter(tag => (profileTags || []).includes(tag));
}

// 取得有效時間：先用 updatedAt，沒有才用 publishedAt；都沒有回傳 null
function getTime(item) {
  const text = item.updatedAt || item.publishedAt;
  if (!text) return null;
  const time = new Date(text).getTime();
  return isNaN(time) ? null : time; // 日期格式錯誤也當作沒有日期
}

// 依時間排序：新的在前、沒日期在後；時間相同比 id
function compareByTime(a, b) {
  const ta = getTime(a);
  const tb = getTime(b);
  if (ta !== tb) {
    if (ta === null) return 1;
    if (tb === null) return -1;
    return tb - ta;
  }
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}

// ---------- 1. 算一則的分數 ----------

function scoreNewsItem(item, profile, now) {
  let score = 0;
  const reasons = [];

  // 議題命中 +40（命中多個也只加一次）
  const topics = matchTags(item.topicTags, profile.topicTags);
  if (topics.length > 0) {
    score += 40;
    reasons.push("符合你關注的議題：" + topics.join("、"));
  }

  // 身分命中 +30（命中多個也只加一次）
  const audiences = matchTags(item.audienceTags, profile.audienceTags);
  if (audiences.length > 0) {
    score += 30;
    reasons.push("可能和你的身分有關：" + audiences.join("、"));
  }

  // 新近度：7 日內 +20，8–30 日 +10，其他 +0
  const time = getTime(item);
  if (time !== null) {
    const days = Math.max(0, Math.floor((new Date(now).getTime() - time) / DAY_MS));
    if (days <= 7) {
      score += 20;
      reasons.push("7 日內有更新");
    } else if (days <= 30) {
      score += 10;
      reasons.push("30 日內有更新");
    }
  }

  // 重要且已核對 +10
  if (item.notificationLevel === "important" && item.verificationStatus === "verified") {
    score += 10;
    reasons.push("已核對的重要進度");
  }

  return { score, reasons };
}

// ---------- 2. 前五則避免連續三則同主題 ----------

// 主題 = topicTags 的第一個；沒有標籤回傳 null
function getMainTopic(entry) {
  const tags = entry.item.topicTags || [];
  return tags.length > 0 ? tags[0] : null;
}

function avoidSameTopic(sorted) {
  const result = [];
  const remaining = sorted.slice(); // 複製一份，不改到原本的陣列

  while (remaining.length > 0) {
    let pickIndex = 0; // 預設拿剩下的第一個（分數最高的）
    const position = result.length; // 現在要放第幾個位置（從 0 開始）

    // 只檢查前五則的第 3～5 個位置
    if (position >= 2 && position < 5) {
      const topic = getMainTopic(remaining[0]);
      const prev1 = getMainTopic(result[position - 1]);
      const prev2 = getMainTopic(result[position - 2]);

      // 前兩則和這則同主題 → 會變成連續三則
      if (topic !== null && prev1 === topic && prev2 === topic) {
        // 往後找第一則不同主題的
        const altIndex = remaining.findIndex(e => getMainTopic(e) !== topic);
        // 找得到，而且分數沒有低超過 10 分，才換
        if (altIndex !== -1 && remaining[0].score - remaining[altIndex].score <= 10) {
          pickIndex = altIndex;
        }
      }
    }

    // 從 remaining 拿出選中的那則，放進 result
    result.push(remaining.splice(pickIndex, 1)[0]);
  }
  return result;
}

// ---------- 3. 為你推薦 ----------

function rankNewsItems(items, profile, now) {
  const scored = items.map(item => {
    const result = scoreNewsItem(item, profile, now);
    return { item: item, score: result.score, reasons: result.reasons };
  });

  scored.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score; // 高分在前
    return compareByTime(a.item, b.item);              // 同分比時間、再比 id
  });

  return avoidSameTopic(scored);
}

// ---------- 4. 我追蹤的 ----------

function followingNewsItems(items, profile) {
  return items
    .filter(item =>
      matchTags(item.topicTags, profile.topicTags).length > 0 ||
      matchTags(item.audienceTags, profile.audienceTags).length > 0
    )
    .sort(compareByTime);
}

// ---------- 5. 最新消息 ----------

function latestNewsItems(items) {
  return items.slice().sort(compareByTime); // slice() 複製，避免改到原陣列
}

// ---------- 6. 搜尋：標題、摘要、標籤 ----------

function matchesQuery(item, query) {
  const q = (query || "").trim().toLowerCase();
  if (q === "") return true; // 沒輸入就全部顯示
  const text = [item.title, item.summary]
    .concat(item.topicTags || [], item.audienceTags || [])
    .join(" ")
    .toLowerCase();
  return text.includes(q);
}

// ---------- 7. 是否要標示「示意／待核」 ----------

function isUnverified(item) {
  const url = item.source && item.source.url;
  return item.verificationStatus !== "verified" || !url;
}

// ---------- 匯出：瀏覽器和 Node 都能用 ----------

const LawRadarRanking = {
  scoreNewsItem,
  rankNewsItems,
  followingNewsItems,
  latestNewsItems,
  matchesQuery,
  isUnverified,
  getTime,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = LawRadarRanking;         // Node：require("./recommendation.js")
} else {
  window.LawRadarRanking = LawRadarRanking; // 瀏覽器：<script src="recommendation.js">
}
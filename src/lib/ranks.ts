export function getRankDetails(xp: number = 0, streak: number = 0) {
  // Ranks based on XP (productivity) and Streak (clean recovery days)
  let rankName = "Benih";
  let badge = "🌱";
  let nextRank = "Tunas";
  let nextRankXp = 100;
  let prevRankXp = 0;
  
  if (xp >= 1000 || streak >= 365) {
    rankName = "Hutan Raksasa";
    badge = "🌳🌳";
    nextRank = "Maksimum";
    nextRankXp = 1000;
    prevRankXp = 1000;
  } else if (xp >= 600 || streak >= 91) {
    rankName = "Pohon Kokoh";
    badge = "🌳";
    nextRank = "Hutan Raksasa";
    nextRankXp = 1000;
    prevRankXp = 600;
  } else if (xp >= 300 || streak >= 31) {
    rankName = "Akar Kuat";
    badge = "🪵";
    nextRank = "Pohon Kokoh";
    nextRankXp = 600;
    prevRankXp = 300;
  } else if (xp >= 100 || streak >= 8) {
    rankName = "Tunas";
    badge = "🌿";
    nextRank = "Akar Kuat";
    nextRankXp = 300;
    prevRankXp = 100;
  }
  
  const currentXpInLevel = xp - prevRankXp;
  const xpNeededInLevel = nextRankXp - prevRankXp;
  const levelProgressPercent = nextRank === "Maksimum" 
    ? 100 
    : Math.max(0, Math.min(100, Math.round((currentXpInLevel / xpNeededInLevel) * 100)));

  return { rankName, badge, nextRank, nextRankXp, prevRankXp, levelProgressPercent };
}

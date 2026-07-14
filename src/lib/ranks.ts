export function getRankDetails(xp: number = 0, streak: number = 0) {
  // Ranks based on XP (productivity) and Streak (clean recovery days)
  // XP requirements are made significantly larger to keep users motivated
  let rankName = "Benih";
  let badge = "🌱";
  let nextRank = "Tunas";
  let nextRankXp = 250;
  let prevRankXp = 0;
  
  if (xp >= 5000 || streak >= 365) {
    rankName = "Hutan Raksasa";
    badge = "🌳🌳";
    nextRank = "Maksimum";
    nextRankXp = 5000;
    prevRankXp = 5000;
  } else if (xp >= 2500 || streak >= 91) {
    rankName = "Pohon Kokoh";
    badge = "🌳";
    nextRank = "Hutan Raksasa";
    nextRankXp = 5000;
    prevRankXp = 2500;
  } else if (xp >= 1000 || streak >= 31) {
    rankName = "Akar Kuat";
    badge = "🪵";
    nextRank = "Pohon Kokoh";
    nextRankXp = 2500;
    prevRankXp = 1000;
  } else if (xp >= 250 || streak >= 8) {
    rankName = "Tunas";
    badge = "🌿";
    nextRank = "Akar Kuat";
    nextRankXp = 1000;
    prevRankXp = 250;
  }
  
  const currentXpInLevel = xp - prevRankXp;
  const xpNeededInLevel = nextRankXp - prevRankXp;
  const levelProgressPercent = nextRank === "Maksimum" 
    ? 100 
    : Math.max(0, Math.min(100, Math.round((currentXpInLevel / xpNeededInLevel) * 100)));

  return { rankName, badge, nextRank, nextRankXp, prevRankXp, levelProgressPercent };
}

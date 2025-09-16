export const saveTimes = (game, times) => {
  localStorage.setItem(`reactionTimes_${game}`, JSON.stringify(times));
};

export const loadTimes = (game) => {
  return JSON.parse(localStorage.getItem(`reactionTimes_${game}`)) || [];
};
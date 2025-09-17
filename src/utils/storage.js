export const saveUserToken = (token) => {
  localStorage.setItem('userToken', token);
};

export const loadUserToken = () => {
  return localStorage.getItem('userToken');
};

// New function to save reaction times, including userId
export const saveTimes = (game, times, userId) => {
  if (userId) {
    localStorage.setItem(`reactionTimes_${game}_${userId}`, JSON.stringify(times));
  } else {
    // Fallback for cases where userId is not provided
    localStorage.setItem(`reactionTimes_${game}`, JSON.stringify(times));
  }
};

// New function to load reaction times, including userId
export const loadTimes = (game, userId) => {
  let times = [];
  if (userId) {
    const saved = localStorage.getItem(`reactionTimes_${game}_${userId}`);
    if (saved) {
      times = JSON.parse(saved);
    }
  } else {
    // Fallback for cases where userId is not provided
    const saved = localStorage.getItem(`reactionTimes_${game}`);
    if (saved) {
      times = JSON.parse(saved);
    }
  }
  return times;
};
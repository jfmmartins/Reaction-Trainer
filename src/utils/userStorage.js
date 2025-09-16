// utils/userStorage.js
export const saveUser = (user) => {
  localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
};

export const loadUser = (id) => {
  const user = localStorage.getItem(`user_${id}`);
  return user ? JSON.parse(user) : null;
};

export const listUsers = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('user_'));
  return keys.map(k => JSON.parse(localStorage.getItem(k)));
};

export const saveCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const loadCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

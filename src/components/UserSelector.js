// components/UserSelector.js
import React, { useState, useEffect } from 'react';
import { listUsers, saveUser, saveCurrentUser, loadCurrentUser } from '../utils/userStorage';

function UserSelector({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    setUsers(listUsers());
    const current = loadCurrentUser();
    if (current) {
      setSelectedUserId(current.id);
      onSelectUser(current.id);
    }
  }, []);

  const handleAddUser = () => {
    if (!newUserName) return;
    const id = 'user_' + Date.now();
    const user = { id, name: newUserName, scores: {} };
    saveUser(user);
    saveCurrentUser(user);
    setUsers([...users, user]);
    setSelectedUserId(user.id);
    onSelectUser(user.id);
    setNewUserName('');
  };

  const handleSelect = (id) => {
    setSelectedUserId(id);
    const user = users.find(u => u.id === id);
    saveCurrentUser(user);
    onSelectUser(id);
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2>Select User</h2>
      <select value={selectedUserId} onChange={(e) => handleSelect(e.target.value)}>
        <option value="">--Select--</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <div style={{ marginTop: '10px' }}>
        <input 
          type="text" 
          placeholder="New user name" 
          value={newUserName} 
          onChange={(e) => setNewUserName(e.target.value)} 
        />
        <button onClick={handleAddUser}>Add</button>
      </div>
    </div>
  );
}

export default UserSelector;

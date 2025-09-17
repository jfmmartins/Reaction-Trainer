import React, { useEffect, useState } from 'react';
import { loadUserToken } from '../utils/storage';

const API_URL = 'http://localhost:5000/api';

function Leaderboard({ selectedGame }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = loadUserToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/leaderboard?game=${encodeURIComponent(selectedGame)}`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data.');
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGame]);

  if (isLoading) {
    return <p>Loading leaderboard...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{selectedGame} - Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No scores submitted yet. Be the first to play!</p>
      ) : (
        <table style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Rank</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Username</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Average Time (ms)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{entry.username}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{Math.round(entry.averageTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
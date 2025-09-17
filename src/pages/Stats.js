import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import Leaderboard from '../components/Leaderboard';
import { loadUserToken } from '../utils/storage';

const API_URL = 'http://localhost:5000/api';

function Stats({ selectedGame, userId }) {
  const [times, setTimes] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [view, setView] = useState('my-stats');
  const [isLoading, setIsLoading] = useState(true);


  // Use a different state for the data that comes from the backend.
  const [backendScores, setBackendScores] = useState([]);

  // Fetch data from the backend on component mount or when selectedGame/userId changes.
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        const token = loadUserToken();
        const response = await fetch(`${API_URL}/stats?game=${encodeURIComponent(selectedGame)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBackendScores(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [selectedGame, userId]);

  const handleDeleteById = async () => {
    if (!deleteId) return;

    if (deleteId.toLowerCase() === "0000") {
      // Logic to delete all scores for the user for this game
      // This requires another API endpoint, let's keep it simple for now and focus on single deletion.
      console.log("Bulk delete not implemented yet.");
      setDeleteId("");
      return;
    }

    const indexToDelete = parseInt(deleteId, 10) - 1; // 1-based index
    if (isNaN(indexToDelete) || indexToDelete < 0 || indexToDelete >= backendScores.length) {
      console.error("Invalid index provided.");
      setDeleteId("");
      return;
    }

    const scoreIdToDelete = backendScores[indexToDelete]._id;
    const token = loadUserToken();

    try {
      const response = await fetch(`${API_URL}/scores/${scoreIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Score deleted successfully!");
        // Update the state to remove the deleted item without a full re-fetch.
        setBackendScores(prevScores => prevScores.filter((score, index) => index !== indexToDelete));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete score:", errorData);
      }
    } catch (error) {
      console.error('Network error during deletion:', error);
    }

    setDeleteId("");
  };

  const formattedTimes = backendScores.map((score, index) => ({
    attempt: index + 1,
    time: score.time,
  }));

  const averageTime = formattedTimes.length > 0
    ? Math.round(formattedTimes.reduce((sum, current) => sum + current.time, 0) / formattedTimes.length)
    : null;

  return (
    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setView('my-stats')}
          style={{ ...toggleButtonStyle, backgroundColor: view === 'my-stats' ? '#00d1b2' : '#ccc' }}
        >
          My Stats
        </button>
        <button
          onClick={() => setView('leaderboard')}
          style={{ ...toggleButtonStyle, backgroundColor: view === 'leaderboard' ? '#00d1b2' : '#ccc' }}
        >
          Leaderboard
        </button>
      </div>

      {view === 'my-stats' ? (
        <>
          <h2>{selectedGame} - My Stats</h2>
          {isLoading ? (
            <p>Loading stats...</p>
          ) : !formattedTimes.length ? (
            <p style={{ textAlign: 'center' }}>No reaction times recorded yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attempt" label={{ value: 'Attempt', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="time" stroke="#6200ea" strokeWidth={2} dot />
                  {averageTime && <ReferenceLine y={averageTime} stroke="red" strokeDasharray="3 3" label={`Avg: ${averageTime}ms`} />}
                </LineChart>
              </ResponsiveContainer>
              <p><strong>Average:</strong> {averageTime} ms</p>
              <div style={{ marginTop: '15px' }}>
                <input
                  type="number"
                  placeholder="Enter attempt number to delete"
                  value={deleteId}
                  onChange={(e) => setDeleteId(e.target.value)}
                  style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #ccc', marginRight: '10px' }}
                />
                <button
                  onClick={handleDeleteById}
                  style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <Leaderboard selectedGame={selectedGame} />
      )}
    </div>
  );
}

const toggleButtonStyle = {
  border: 'none',
  color: 'white',
  padding: '10px 20px',
  margin: '0 5px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default Stats;
// components/Stats.js
import React, { useEffect, useState } from 'react';
import { loadTimes, saveTimes } from '../utils/storage';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

function Stats({ selectedGame }) {
  const [times, setTimes] = useState([]);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    const saved = loadTimes(selectedGame);
    setTimes(Array.isArray(saved) ? saved : []);
  }, [selectedGame]);

  const handleDeleteById = () => {
    if (!deleteId) return;

    if (deleteId.toLowerCase() === "0000") {
      // Delete all records
      setTimes([]);
      saveTimes(selectedGame, []);
    } else {
      const id = parseInt(deleteId, 10);
      if (isNaN(id) || id < 1 || id > times.length) return;

      const updated = times.filter((_, index) => index !== id - 1); // id is 1-based
      setTimes(updated);
      saveTimes(selectedGame, updated);
    }

    setDeleteId(""); // Reset input
  };

  if (!times.length) {
    return <p style={{ textAlign: 'center' }}>No reaction times recorded yet.</p>;
  }

  const data = times.map((t, i) => ({ attempt: i + 1, time: t }));
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);

  return (
    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{selectedGame} - Stats</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="attempt" label={{ value: 'Attempt', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="time" stroke="#6200ea" strokeWidth={2} dot />
          <ReferenceLine y={avg} stroke="red" strokeDasharray="3 3" label={`Avg: ${avg}ms`} />
        </LineChart>
      </ResponsiveContainer>

      <p><strong>Average:</strong> {avg} ms</p>

      <div style={{ marginTop: '15px' }}>
        <input
          type="number"
          placeholder="Enter attempt number to delete"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleDeleteById}
          style={{
            backgroundColor: '#e63946',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Stats;

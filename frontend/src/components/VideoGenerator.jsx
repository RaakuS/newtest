import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import FeedbackForm from './FeedbackForm.jsx';

const topics = [
  { value: 'bees', label: 'How bees carry pollen' },
  { value: 'water-cycle', label: 'The water cycle' },
  { value: 'emotions', label: 'Understanding emotions' },
  { value: 'plants', label: 'How plants grow' },
  { value: 'recycling', label: 'Why we recycle' }
];

export default function VideoGenerator({ token }) {
  const [topic, setTopic] = useState(topics[0].value);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ topic, name, theme })
    });
    const data = await res.json();
    setUrl(data.url);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create a Micro-Explainer</h2>
      <div>
        <label>Topic: </label>
        <select value={topic} onChange={e => setTopic(e.target.value)}>
          {topics.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label>Child Name: </label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label>Theme: </label>
        <input value={theme} onChange={e => setTheme(e.target.value)} />
      </div>
      <button onClick={generate} disabled={loading}>Generate</button>
      {loading && <p>Loading...</p>}
      {url && (
        <div>
          <video src={url} controls width="360" />
          <QRCode value={url} />
          <FeedbackForm token={token} />
        </div>
      )}
    </div>
  );
}

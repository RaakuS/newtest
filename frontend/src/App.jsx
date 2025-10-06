import React, { useState } from 'react';
import VideoGenerator from './components/VideoGenerator.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [showPolicy, setShowPolicy] = useState(false);

  const requestLink = async () => {
    const res = await fetch('/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setToken(data.token);
  };

  if (showPolicy) return <PrivacyPolicy />;

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h1>KidStory Micro-Explainers</h1>
        <p>Enter parent email to start</p>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={requestLink}>Send Magic Link</button>
        <button onClick={() => setShowPolicy(true)}>Privacy Policy</button>
      </div>
    );
  }

  return <VideoGenerator token={token} />;
}

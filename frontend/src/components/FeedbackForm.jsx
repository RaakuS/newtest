import React, { useState } from 'react';

export default function FeedbackForm({ token }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async () => {
    await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });
    setSent(true);
  };

  if (sent) return <p>Thanks for feedback!</p>;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Feedback</h3>
      <button onClick={() => setRating('up')}>👍</button>
      <button onClick={() => setRating('down')}>👎</button>
      <div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button onClick={submit}>Submit</button>
    </div>
  );
}

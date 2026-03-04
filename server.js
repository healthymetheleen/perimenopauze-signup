// Load .env locally; on Sevalla/production, env vars are set in the dashboard
require('dotenv').config({ path: process.env.ENV_PATH || '.env' });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('.'));

const API_KEY = process.env.MAILERLITE_API_KEY;
const GROUP_ID = '181044268616385611';

app.post('/subscribe', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is verplicht' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        fields: { name: name || '' },
        groups: [GROUP_ID],
      }),
    });

    const data = await response.json();

    if (response.ok || response.status === 200 || response.status === 201) {
      return res.json({ success: true });
    }

    console.error('MailerLite error:', data);
    return res.status(500).json({ error: 'Aanmelding mislukt, probeer opnieuw.' });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Server fout, probeer opnieuw.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Signup server draait op http://localhost:${PORT}`));

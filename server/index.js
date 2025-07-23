require('dotenv').config();
const express = require('express');
const { getRecentApplicationEmails } = require('./gmail');
const { parseApplicationEmail } = require('./parser');
const db = require('./db');

let lastScanTime = null;
let nextScanTime = null;
const SCAN_INTERVAL_MS = 15 * 60 * 1000; // 15 dakika

(async () => {
  await db.ensureTable();
})();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/applications', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM applications ORDER BY applied_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Veritabanı hatası' });
  }
});

app.get('/api/scan-status', (req, res) => {
  res.json({
    lastScanTime,
    nextScanTime,
    intervalMinutes: SCAN_INTERVAL_MS / 60000
  });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

async function run() {
  const emails = await getRecentApplicationEmails();

  for (let email of emails) {
    const appData = parseApplicationEmail(email);

    if (appData.company_name && appData.position_title) {
      await db.query(
        `INSERT INTO applications (company_name, position_title, applied_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (company_name, position_title) DO NOTHING`,
        [appData.company_name, appData.position_title, appData.applied_at]
      );

      console.log(`[+] ${appData.company_name} için başvuru eklendi`);
    } else {
      console.log('[!] Mail parse edilemedi:', email.subject);
    }
  }

  lastScanTime = new Date();
  nextScanTime = new Date(Date.now() + SCAN_INTERVAL_MS);
}

// Otomatik tarama başlat
run();
setInterval(run, SCAN_INTERVAL_MS);

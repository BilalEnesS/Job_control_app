const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  return pool.query(text, params);
}

// Uygulama başlarken tabloyu oluştur ve unique constraint ekle
async function ensureTable() {
  // Tabloyu oluştur
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      company_name TEXT NOT NULL,
      position_title TEXT NOT NULL,
      applied_at TIMESTAMP NOT NULL
    );
  `);

  // UNIQUE constraint ekle (zaten varsa hata vermez)
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_company_position'
      ) THEN
        ALTER TABLE applications
        ADD CONSTRAINT unique_company_position UNIQUE (company_name, position_title);
      END IF;
    END
    $$;
  `);
}

module.exports = { query, ensureTable };

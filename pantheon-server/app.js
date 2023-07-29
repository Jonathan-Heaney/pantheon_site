require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(cors());

app.get('/people/:year', async (req, res) => {
  const year = req.params.year;
  const result = await pool.query(`
        SELECT *, ${year} - birthyear as age 
        FROM pantheon 
        WHERE birthyear <= ${year} AND (deathyear >= ${year} OR deathyear IS NULL) 
        ORDER BY hpi DESC 
        LIMIT 10
    `);
  res.json(result.rows);
});

app.listen(3001, () => console.log('Server is running on port 3001'));

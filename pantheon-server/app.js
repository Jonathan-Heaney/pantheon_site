const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
require('dotenv').config();

const app = express();
app.use(cors());

const db = pgp({
  connectionString: process.env.DATABASE_URL,
});

app.get('/people/:year', async (req, res) => {
  const year = parseInt(req.params.year);
  const occupation = req.query.occupation;
  let query = `SELECT *, ${year} - birthyear AS age FROM pantheon WHERE birthyear <= $1 AND (deathyear >= $1 OR deathyear IS NULL) ORDER BY hpi DESC LIMIT 10`;
  let values = [year];

  if (occupation) {
    query = `SELECT *, ${year} - birthyear AS age FROM pantheon WHERE LOWER(occupation) LIKE LOWER('%' || $2 || '%') AND birthyear <= $1 AND (deathyear >= $1 OR deathyear IS NULL) ORDER BY hpi DESC LIMIT 10`;
    values.push(occupation);
  }

  try {
    const result = await db.any(query, values);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

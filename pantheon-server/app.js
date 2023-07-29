const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = pgp({
  connectionString: process.env.DATABASE_URL,
});

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
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
    console.log('Server occupations: ', result); // debug log
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/occupations', async (req, res) => {
  const query = 'SELECT DISTINCT occupation FROM pantheon ORDER BY occupation';

  try {
    const result = await db.any(query);
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

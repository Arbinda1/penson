const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'Arar123@', 
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

  app.post('/add_person', async (req, res) => {
    const { name, age } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO persons (name, age) VALUES ($1, $2) RETURNING id, name, age, age >= 65 AS pension_status',
        [name, age]
      );
      const person = result.rows[0];
      console.log('Person added:', person);
      res.json({ person });
    } catch (err) {
      console.error(err.stack);
      res.status(500).send('Error adding person');
    }
  });
  

app.get('/persons', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM persons');
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error retrieving persons');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

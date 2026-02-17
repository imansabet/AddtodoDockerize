const pool = require('./db');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let todos = [] ;
app.get('/api/todos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM todos');
    res.json(rows);
});

app.post('/api/todos', async (req, res) => {
    const { title } = req.body;
    const [result] = await pool.query(
        'INSERT INTO todos(title) VALUES(?)',
        [title]
    );
    res.json({ id: result.insertId, title });
});


app.delete('/api/todos/:id', async (req, res) => {
    await pool.query('DELETE FROM todos WHERE id=?', [req.params.id]);
    res.sendStatus(200);
});


async function initDb() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255)
        )
    `);
}

initDb();



app.listen(3000 , () =>{
    console.log("Server Started on Port 3000 ");
});

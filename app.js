const express = require('express');
const app  = express();

app.use(express.static('public'));

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'goalie31',
    database: 'oboeru'
  });

app.get('/', (req, res) => {
    res.render('top.ejs');
});

app.get('/add', (req, res) => {
    res.render('add.ejs');
});

app.get('/index', (req, res) => {
    connection.query(
        'select * from list',
        (error, results) => {
            console.log(results);
            res.render('index.ejs', {list: results});
        }
    )
  }
);

app.get('/test', (req, res) => {
    res.render('test.ejs');
});

app.listen(3000);
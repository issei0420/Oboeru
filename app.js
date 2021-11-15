const express = require('express');
const app  = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

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

app.post('/add_word', (req, res) => {
    //追加された単語を出力
    console.log(req.body.questionName);
    //単語リストを表示する処理
    connection.query(
        'select * from list',
        (error, results) => {
            res.render('index.ejs', {list: results});
        }
    )
});

app.get('/index', (req, res) => {
    connection.query(
        'select * from list',
        (error, results) => {
            res.render('index.ejs', {list: results});
        }
    )
  }
);

app.get('/test', (req, res) => {
    res.render('test.ejs');
});

app.listen(3000);
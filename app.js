const express = require('express');
const app  = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const mysql = require('mysql');

const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: 'goalie31',
    database: 'oboeru',
  });

app.get('/', (req, res) => {
    res.render('top.ejs')
})

app.get('/front', (req, res) => {
    res.render('front.ejs');
});

app.get('/add', (req, res) => {
    res.render('add.ejs');
});

app.post('/add_word', (req, res) => {
    
    connection.query(
        'insert into list(question, answere) values(?, ?)',
        [req.body.questionName, req.body.answereName],
        (error, results) => {
            res.redirect('/add');
        }
    );
});

// 削除処理
app.post('/delete/:id', (req, res) => {
    connection.query(
        'delete from list where id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

// 編集画面表示
app.get('/edit/:id', (req, res) => {
    connection.query(
        'select * from list where id=?',
        [req.params.id],
    (error, results)  => {
        console.log(results)
        res.render('edit.ejs', {word:results[0]});
     }
    );
});

//更新処理
app.post('/update/:id', (req, res) => {
    connection.query(
        'update list set question = ?, answere = ? where id = ?',
        [req.body.questionName, req.body.answereName, req.params.id],
        (error, results) => {
          res.redirect('/index');
        }
      );
})



app.get('/index', (req, res) => {
    connection.query(
        'select * from list',
        (error, results) => {
            res.render('index.ejs', {list: results});
        }
    )
  }
);

//テスト機能
let counter = 1;
app.get('/test', (req, res) => {
    console.log(counter);
    connection.query(
        'select * from list limit ?, ?',
        [counter-1, counter],
        (error, results) => {
            res.render('test.ejs', {word: results[0]});
            // list_length = results[1].count(quesiton);
            // console.log(results[1]);
            counter += 1;
        }
    );

    connection.query(
        'select count(question) from list',
        (error, results) => {
            console.log(results[0]);
            
        }
    )
});

app.listen(3000);
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

//トップページ
app.get('/', (req, res) => {
    connection.query(
        'show tables',
        (error, results) => {
            res.render('top.ejs', {note: results});
        }
    )
})

//ノート名変更画面
app.get('/change_name/:listName', (req, res) => {
    res.render('change_name.ejs', {name: req.params.listName});
});

//名前変更処理
app.post('/change_function/:listName', (req, res) => {
    connection.query(
        'rename table ?? to ??',
        [req.params.listName, req.body.newName],
        (error, results) => {
            res.redirect('/');
        }
    )
})

//ノート削除
app.get('/delete_note/:listName', (req, res) => {
    connection.query(
        'drop table ?? ',
        [req.params.listName],
        (error, results) => {
            res.redirect('/');
        }
    )
})

//ノート追加画面
app.get('/add_note', (req, res) => {
    res.render('note_name.ejs');
})

//ノート追加機能
app.post('/add_function', (req, res) => {
    connection.query(
        'create table ??(id int auto_increment, question text, answere text, primary key(id))',
        [req.body.listName],
        (error, results) => {
            res.redirect('/');
        }
    )
})

//ノート表紙
app.get('/front/:listName', (req, res) => {
    res.render('front.ejs', {list: req.params.listName});
});
//一覧画面
app.get('/index/:listName', (req, res) => {
    connection.query(
        'select * from ??',
        [req.params.listName],
        (error, results) => {
            console.log(req.params.listName)
            console.log(results);
            res.render('index.ejs', {list: results, list_name: req.params.listName});
        }
    )
  }
);

//単語追加画面
app.get('/add/:listName', (req, res) => {
    res.render('add.ejs', {list: req.params.listName});
});

//単語追加処理
app.post('/add_word/:listName', (req, res) => {
    
    connection.query(
        'insert into ??(question, answere) values(?, ?)',
        [req.params.listName, req.body.questionName, req.body.answereName],
        (error, results) => {
            res.render('add.ejs', {list: req.params.listName});
        }
    );
});

// 削除処理
app.post('/delete/:id/:listName', (req, res) => {
    connection.query(
        'delete from ?? where id = ?',
        [req.params.listName, req.params.id],
        (error, results) => {
            res.redirect('/index/:listname');
        }
    );
});

// 編集画面表示
app.get('/edit/:id/:listName', (req, res) => {l
    connection.query(
        'select * from ?? where id=?',
        [req.params.listName, req.params.id],
    (error, results)  => {
        console.log(results)
        res.render('edit.ejs', {word:results[0]});
     }
    );
});

//更新処理
app.post('/update/:id/:listName', (req, res) => {
    connection.query(
        'update ?? set question = ?, answere = ? where id = ?',
        [req.body.listName, req.body.questionName, req.body.answereName, req.params.id],
        (error, results) => {
        res.redirect('/index/:listname');
        }
      );
})

//テスト機能
let counter = 1;
app.get('/test/:listName', (req, res) => {
    let length;


    connection.query(
        'select count(question) from ??',
        [req.params.listName],
        (error, results) => {
            length = results[0]['count(question)'];
            }
        )

    connection.query(
        'select * from ?? limit ?, ?',
        [req.params.listName, counter-1, counter],
        (error, results) => {
            if(counter<=length){
                res.render('test.ejs', {word: results[0], list: req.params.listName});
                counter += 1;
            }else{
                res.render('front.ejs', {list: req.params.listName});
                counter = 0;
            }
        }
    );

    
});

app.listen(3000);
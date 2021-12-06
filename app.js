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
            // console.log(results);
            // console.log(results[0]);
            // console.log(results[1]);
        }
    )
})

//ノート名変更画面
app.get('/change_name/:listName', (req, res) => {
    // console.log(req.params.listName);
    res.render('change_name.ejs', {name: req.params.listName});
});

//名前変更処理
app.post('/change_function/:listName', (req, res) => {
    connection.query(
        'rename table ?? to ??',
        [req.params.listName, req.body.newName],
        (error, results) => {
            console.log(req.params.listName);
            console.log(req.body.newName);
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
            console.log(req.params.listName)
            res.redirect('/');
        }
    )
})


//ノート追加機能
app.post('/add_note', (req, res) => {
    connection.query(
        'create table new_list( question text, answere text)',
        (error, results) => {
            res.redirect('/');
        }
    )
})

//ノート表紙
app.get('/front', (req, res) => {
    res.render('front.ejs');
});
//一覧画面
app.get('/index', (req, res) => {
    connection.query(
        'select * from list',
        (error, results) => {
            res.render('index.ejs', {list: results});
        }
    )
  }
);

//単語追加画面
app.get('/add', (req, res) => {
    res.render('add.ejs');
});

//単語追加処理
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
app.get('/edit/:id', (req, res) => {l
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

//テスト機能
let counter = 1;
app.get('/test', (req, res) => {
    let length;


    connection.query(
        'select count(question), count(answere) from list',
            (error, results) => {
                length = results[0]['count(question)'];
                console.log(length);
            }
        )

    connection.query(
        'select * from list limit ?, ?',
        [counter-1, counter],
        (error, results) => {
            if(counter<=length){
                res.render('test.ejs', {word: results[0]});
                counter += 1;
            }else{
                res.render('front.ejs');
                counter = 0;
            }
        }
    );

    
});

app.listen(3000);
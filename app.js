const express = require('express');

const app = express();

app.use(express.json()); 

const mysql = require('mysql2');

require('dotenv').config(); 

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/futar', (req, res) => { 
    res.render('index');
});
app.get('/futar/create', (req, res) => { 
    res.render('create');
});
app.get('/futar/read', (req, res) => { 
    res.render('read');
});
app.get('/futar/update', (req, res) => { 
    res.render('update');
});
app.get('/futar/delete', (req, res) => { 
    res.render('delete');
});

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

connection.connect(function(err) {  
    if (err) {  
        console.error('Hiba a kapcsolatban: ' + err.stack); 
        return; 
    }
    console.log('Kapcsolódva az adatbázishoz.'); 
});

app.get('/futar/read', (req, res) => {
    let sql = 'SELECT fazon, fnev, ftel FROM futar';
    connection.query(sql, function(err, rows) {
        if (err) { 
            console.error(err); 
            res.status(500).send('Adatbázis hiba történt.'); 
            return; 
        }
        //res.send(rows);
    });
});

app.get('/futar/read/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT fazon, fnev, ftel FROM futar WHERE fazon = ?';
    let sqlParams = [id];
    connection.query(sql, sqlParams, function(err, rows) { 
        if (err) {  
            console.error(err);  
            res.status(500).send('Adatbázis hiba történt.');  
            return;  
        }
        res.send(rows);  
    });
});

app.post('/futar/create', (req, res) => {
    let uj = req.body;
    let sql = 'INSERT INTO futar (fazon, fnev, ftel) VALUES (NULL, ?, ?)';
    let sqlParams = [uj.fnev, uj.ftel];  
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {  
            console.error(err);  
            res.status(500).send('Adatbázis hiba történt.');  
            return;  
        }
        let lastInsertId = rows.insertId;
        res.status(201).send(lastInsertId, rows.fnev, rows.ftel);
    });
});

app.put('/futar/update/:id', (req, res) => {
    let id = req.params.id;
    let uj = req.body;
    let sql = 'UPDATE futar SET fnev = ?, ftel = ? WHERE fazon = ?';
    let sqlParams = [uj.fnev, uj.ftel, id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {  
            console.error(err);  
            res.status(500).send('Adatbázis hiba történt.');  
            return;  
        }
        res.status(201).send(rows);
    });
});

app.delete('/futar/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM futar WHERE fazon = ?';
    let sqlParams = [id];  
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {  
            console.error(err);  
            res.status(500).send('Adatbázis hiba történt.');  
            return;  
        }
        res.status(201).send(rows);
    });
});



app.listen(3000, () => {
    console.log('A szerver elindult a 3000-es porton.');
});
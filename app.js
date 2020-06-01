var express = require('express');
var session = require('express-session');

var app = express();

app.set('view engine', 'ejs');
app.use('/', express.static('assets'));

app.get('/', (req,res)=>{
    res.render('index');
});

app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/signup', (req,res)=>{
    res.render('signup');
});

app.get('/dashboard', (req,res)=>{
    res.render('dashboard');
});

app.get('/invite', (req,res)=>{
    res.render('invitation');
})

app.listen(process.env.PORT || 5000);


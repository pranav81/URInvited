var express = require('express');
var session = require('express-session');
var mysql = require('mysql');

var session = require('express-session');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'September@2001',
	database : 'URInvited'
});

var app = express();

app.set('view engine', 'ejs');
app.use('/', express.static('assets'));

app.use(session({
	secret: 'my secret code for URInvited',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    req.session.loggedin = false;
    res.render('index');

});

app.get('/login', (req,res)=>{
    res.render('login');
});

app.post('/auth', (req,res)=>{
    var username = req.body.username;
	var password = req.body.password;
    if (username && password) {
		connection.query('SELECT * FROM UserAccounts WHERE Username = ? AND Password = ?', [username, password], function(error, results, fields) {
        // connection.query('SELECT * FROM USERACCOUNTS', function(error, results){
            if (error) throw error;
            if (results.length>0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/dashboard');
			} else {
				res.send('Incorrect Username and/or Password!');
            }		
            
            console.log(results);	
			res.end();
		});
    } 
})

app.get('/signup', (req,res)=>{
    res.render('signup');
});

app.post('/signupauth', function(req, res) {
    var name = req.body.name;
    var username = req.body.username;
	var password = req.body.password;
	if (username && password && name) {
        var q = 'INSERT INTO UserAccounts (Name,Username,Password) VALUES (?,?,?)';
		connection.query(q, [name, username, password], function(error, results, fields) {
        // connection.query('SELECT * FROM USERACCOUNTS', function(error, results){
            if (error) throw error;
            // if (results.length>0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/dashboard');
			// } else {
			// 	res.send('Incorrect Username and/or Password!');
            // }		
            
            console.log(results);	
			res.end();
		});
    } 
    // else {
	// 	response.send('Please enter Username and Password!');
	// 	response.end();
	// }
});

app.get('/dashboard', (req,res)=>{
    if(req.session.loggedin){
        res.render('dashboard');
    }else{
        res.redirect('/login');
        res.end();
    }
});

app.get('/invite', (req,res)=>{
    if(req.session.loggedin){    
        res.render('invitation');
    }else{
        res.redirect('/login');
        res.end();
    }
});

app.post('/addinvitation', (req, res)=>{
    var title = req.body.title;
    var body = req.body.body;
    var dtv = req.body.dtv;
    var footer = req.body.footer;
    var author = req.session.username;
    var recipients = (JSON.stringify(req.body.recipients.split(',')));
    
    if(title && body && dtv && footer && author){
        var q= 'INSERT INTO Invitations VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(q, [title, body, dtv, footer, author, recipients], function(error, results, fields) {
            if (error) throw error;
            res.redirect('/dashboard');
        });
        
    }
});

app.listen(process.env.PORT || 5000);


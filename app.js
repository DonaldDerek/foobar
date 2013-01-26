var express = require('express');
var app = express();
var MemoryStore = require('connect').session.MemoryStore;

// Import the data layer
var mongoose = require('mongoose');

var Account = require('./models/Account')(mongoose);

app.configure(function(){
    app.set('view engine','jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.limit('1mb'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session(
    {
        secret: "X123SA24SA", 
        store: new MemoryStore()
        }));
    mongoose.connect('mongodb://localhost/foobar');
});

app.get('/',function(req, res){
    res.render('index.jade');
});
app.post('/login', function(req, res){
    console.log('Login Request');
    var email = req.param('email',null);
    var password = req.param('password',null);
    
    if(null == email || email.length < 1 || null == password || password.length <1){
        res.send(400);
        return;
    }
    
    Account.login(email, password, function(success){
        if( !success){
            res.send(401);
            return;
        } 
        console.log('login was successful');
        req.session.loggedIn = true;
        res.send(200);
    });
});

app.post('/register', function(req, res){
   
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var password = req.param('password', null);
   
    if(null == email || email.length < 1 || null == password || password.length < 1){
        res.send(400);
        return;
    }
    
    Account.register(email, password, firstName, lastName);
    res.send(200);
   
});

app.get('/account/authenticated', function(req, res){
    if( req.session.loggedIn){
        res.send(200);
    } else{
        res.send(401);
        
    }
});


app.listen('3214');

/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , models = require('./models')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env.SECRET || 'your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  var uristring = 
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    'mongodb://localhost/newsblr';
  var mongoOptions = { db: { safe: true }};

  mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) {
      console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log('Succeeded connecting to:' + uristring + '.');
    }
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function checkLoggedIn() {
  return function(req, res, next) {
    if (!req.session.user){
      res.render('login', {title: 'Please log in or sign up'});
    } else {
      next();
    };
  }
}

app.get('/', checkLoggedIn(), routes.index);
app.get('/login', routes.getInfo);
app.post('/login', routes.login);
app.post('/new', checkLoggedIn(), routes.new);
app.get('/me', checkLoggedIn(), routes.me);
app.post('/results', checkLoggedIn(), routes.results);
app.get('/feed/:url', checkLoggedIn(), routes.feed);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

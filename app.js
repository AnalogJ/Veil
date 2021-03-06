
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var partials = require('./routes/partials');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var lessMiddleware = require('less-middleware');

var app = express();
app.engine('ejs', engine);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);

//bootstrap-less configuration.
var bootstrapPath = path.join(__dirname, 'public', 'lib', 'bootstrap-theme-cirrus');
app.use('/img', express.static(path.join(bootstrapPath, 'img')));
app.use(lessMiddleware({
    src: __dirname + '/public',
    paths  : [path.join(bootstrapPath, 'css')],
    compress: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/partials/:name', partials.wildcard);
//app.all('*', routes.index);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

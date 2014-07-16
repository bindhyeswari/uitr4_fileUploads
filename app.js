
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var uuid = require('node-uuid');
var database = {};

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/fileupload', function (req, res) {
    console.log(req);
    var filename = uuid.v1();
    console.log(filename);
    var headers = JSON.stringify(req.headers);
    database.write({
        _id: filename,
        headers: headers
    });
    console.log(database.files.length);
    res.json(200, {message: 'File uploaded ... '});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

    database.files = JSON.parse(fs.readFileSync(__dirname + '/database.json'));

    database.write = function(data){
        database.files.push(data);

        fs.writeFileSync(__dirname + '/database.json', JSON.stringify(database.files));
    }
});

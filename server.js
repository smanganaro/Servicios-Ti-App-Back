//Initiallizing node modules
var express = require("express");
var bodyParser = require("body-parser");
var app = express(); 

var dashboardRouter = require('./routes/dashboard');

//Setting up server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
    });

// Body Parser Middleware
app.use(bodyParser.json()); 

app.use('/api/dashboard', dashboardRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //console.log(err);
  res.status(err.status || 500);

  //res.render('error');
  res.status(500).send(err.status);
});
/*

module.exports = app;


//Initiallising connection string
/*var connection = mysql.createConnection ({
    host: '192.168.1.97',
    port: 3306,
    user: 'integracion',
    password: 'password',
    database: 'centreon2_storage',
    insecureAuth: true,
    flags: 'PLUGIN_AUTH'
});*/

//Function to connect to database and execute query
/*var executeQuery = function(res, query){             
    connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            } 
    console.log('connected as id ' + connection.threadId);
    });

    connection.query(mysql, function (err, result) {
    if (err) {
                console.error('error executing query: ' + err.stack);
                return;
            } 
    console.log("Result: " + result);
  });

}*/



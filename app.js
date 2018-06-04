var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const { Model } = require('objection');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  morgan('dev', {
    skip: (req, res) => {
      if (res.statusCode >= 400 || req.url.includes('/health')) return true;
      return false;
    },
    stream: process.stdout,
  }),
);
app.use(
  morgan('dev', {
    skip: (req, res) => {
      if (res.statusCode < 400 || req.url.includes('/health')) return true;
      return false;
    },
    stream: process.stderr,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  }),
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// setup database connection
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'etsy_scraper',
  },
  pool: { min: 0, max: 10 },
});
Model.knex(knex);

app.use((err, req, res, next) => {
  console.info(err);
  res.status(400).send(`Oops! We ran into an error!\n\n${err}`);
});

app.listen(8080, () => {
  console.info('Server running on http://localhost:');
});

// module.exports = app;

const express = require('express');
const path = require('path');
const session = require('express-session');

// Port
const port = 3000;

// init app
const app = express();

const index = require('./routes/index');
const evenements = require('./routes/evenements');
const articles = require('./routes/articles');
const article = require('./routes/article');
const galerie = require('./routes/galerie');
const contact = require('./routes/contact');
const manage = require('./routes/manage');
const header = require('./routes/header');

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body paser
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', index);
app.use('/evenements', evenements);
app.use('/articles', articles);
app.use('/article', article);
app.use('/galerie', galerie);
app.use('/contact', contact);
app.use('/manage', manage);
app.use('/header', header);

// On route les différentes pages statiques
app.get('/le-collectif', function(req, res) {
  res.sendFile(__dirname + "/public/le-collectif.html");
});

app.get('/studio-JK', function(req, res) {
  res.sendFile(__dirname + "/public/studio-JK.html");
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

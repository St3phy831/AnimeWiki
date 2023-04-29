const express = require("express");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const saltRounds = 10;
const session = require('express-session')
const cookieParser = require("cookie-parser");
require('dotenv').config();
const app = express();
const pool = dbConnection();

// Required parameters to use session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { cookies: true }
}))

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
//to parse Form data sent using POST method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uses session variables to authnticate user and make sure
// user can't access other profiles by changing the id in
// the query string

//routes
app.get('/', (req, res) => {
  res.render('home')
});

// Handles sing up functionality
app.post('/signup', async (req, res) => {
  let username = req.body.username;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let password = req.body.password;
  let rePassword = req.body.rePassword;
  // console.log(typeof(username));
  let sql = `SELECT username 
              FROM users
              WHERE username = ?`;
  let rows = await executeSQL(sql, [username]);
  if (username == "" || firstName == "" || lastName == "" || password == "" || rePassword == "") { //username exists in database
    res.render('home', { "error": "Error: Fields Can't Be Empty" })
  } else if (rows.length > 0) { //username exists in database
    res.render('home', { "error": "Error: Username Already Exists" })
  } else if (password != rePassword) { //pass don't match
    res.render('home', { "error": "Error: Passwords Don't Match" })
  } else {
    // encrypt and add to table
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(password, salt);
    let sql = `INSERT INTO users
               (username, firstName, lastName, password)
               VALUES
               (?, ?, ?, ?)`;
    let rows = await executeSQL(sql, [username, firstName, lastName, hash]);
    // call function that returns all of users info
    rows = await getUserInfo(username);
    // set auth to true
    req.session.authenticated = true;
    req.session.currId = rows[0].userId;
    res.redirect(`/profile?id=${rows[0].userId}`)
  }
});

// Handles log in functionality
app.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let passwordHash = "";
  // call function that returns all of user's info
  rows = await getUserInfo(username);
  // console.log(rows);
  if (username == "" || password == "") {
    res.render('home', { "error": "Error: Fields Can't be Empty" })
  }
  else if (rows.length == 0) { //username doesn't exist
    res.render('home', { "error": "Error: Incorrect Username" })
  } else {
    passwordHash = rows[0].password;
    const match = await bcrypt.compare(password, passwordHash);
    // console.log(rows[0].userId);
    if (match) {
      req.session.authenticated = true;
      req.session.currId = rows[0].userId;
      res.redirect(`/profile?id=${rows[0].userId}`)
    } else {
      res.render('home', { "error": "Error: Wrong Credentials" })
    }
  }
});

app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/topRec', isAuthenticated, isUser, async (req, res) => {
  let userId = req.query.id;
  rows = await getUserInfoById(userId);
  res.render('topRecs', {"user": rows})
});

app.get('/search', isAuthenticated, isUser, async (req, res) => {
  let userId = req.query.id;
  rows = await getUserInfoById(userId);
  res.render('search', { "user": rows })
});

app.get('/myWatchlist', isAuthenticated, isUser, async (req, res) => {
  let userId = req.query.id;
  // gets userInfo & all anime for specific user
  userInfo = await getUserInfoById(userId);
  let sql = `SELECT * 
              FROM anime
              WHERE userId = ?`;
  let params = [userId];
  let rows = await executeSQL(sql, params);
  res.render('watchlist', { "user": userInfo, "anime": rows })
});

// Deletes specific user's anime from list
// Since each entry has unique animeId, no need to check if it's the 
// right user because only that user's anime is displayed
app.post('/delFromWatchlist', isAuthenticated, isUser, async (req, res) => {
  let animeId = req.body.animeId;
  let userId = req.body.id;
  let sql = `DELETE 
               FROM anime
               WHERE animeId = ${animeId}`;
  let rows = await executeSQL(sql);
  res.redirect(`/myWatchlist?id=${userId}`)
});

// Allows users to add anime to watchlist
app.post('/addToWatchlist', isAuthenticated, isUser, async (req, res) => {
  let userId = req.body.id;
  let title = req.body.title;
  let imgUrl = req.body.imgUrl;
  let url = `${process.env.URL}/api/watchlist/${userId}&${title}`;
  let response = await fetch(url);
  let data = await response.json();
  // if already not added to watchlist then insert
  if (data.length == 0) {
    // perform sql
    let sql = `INSERT INTO anime
                (title, userId, imgUrl)
                VALUES
                (?, ?, ?)`;
    let params = [title, userId, imgUrl];
    let rows = await executeSQL(sql, params);
  }
  // console.log(data);
  // console.log(userId, title, imgUrl);
  res.redirect(`/myWatchlist?id=${userId}`)
});

// API will be used to check if anime already added to watchlist
app.get('/api/watchlist/:id&:title', async (req, res) => {
  let userId = req.params.id;
  let title = req.params.title;

  let sql = `SELECT title
              FROM anime 
              WHERE userId = ? AND title = ?`;

  let params = [userId, title];

  let rows = await executeSQL(sql, params);
  // when use api use send
  res.send(rows);
});

app.get('/profile', isAuthenticated, isUser, async (req, res) => {
  let userId = req.query.id;
  rows = await getUserInfoById(userId);
  res.render('profile', { "user": rows })
});

// Updates user's info
app.post('/profile', isAuthenticated, isUser, async (req, res) => {
  let userId = req.body.id;
  let fName = req.body.firstName;
  let lName = req.body.lastName;
  rows = await getUserInfoById(userId);
  // console.log(userId, fName, lName);
  if (fName == "" || lName == "") {
    res.render('profile', { "user": rows, "error": "Error: Fields Can't be Empty" })
  } else {
    // UPDATES Info User Inputted
    let sql = `UPDATE users
              SET
                firstName = ?,
                lastName = ?
              WHERE
                userId = ?`;
    let params = [fName, lName, userId];
    rows = await executeSQL(sql, params);
    rows = await getUserInfoById(userId);
    res.render('profile', { "user": rows })
  }
});

// Updates user's password
app.post('/updatePass', isAuthenticated, isUser, async (req, res) => {
  let userId = req.body.id;
  let password = req.body.password;
  rows = await getUserInfoById(userId);
  // console.log(userId, fName, lName);
  if (password == "") {
    res.render('profile', { "user": rows, "error2": "Error: Field Can't be Empty" })
  } else {
    // UPDATES password
    // encrypt new password
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(password, salt);
    let sql = `UPDATE users
              SET
                password = ?
              WHERE
                userId = ?`;
    let params = [hash, userId];
    rows = await executeSQL(sql, params);
    rows = await getUserInfoById(userId);
    // console.log(password);
    // console.log(hash);
    res.render('profile', { "user": rows })
  }
});

app.get('/userReviews', isAuthenticated, isUser, async (req, res) => {
  let userId = req.query.id;
  // gets userInfo & all anime for specific user
  userInfo = await getUserInfoById(userId);
  let sql = `SELECT *
             FROM reviews r
             INNER JOIN users u
             ON r.userId = u.userId`;
  let rows = await executeSQL(sql);
  // console.log(userInfo);
  res.render('userReviews', { "user": userInfo, "reviews": rows})
});

// Deletes specific user's review
app.post('/delReview', isAuthenticated, isUser, async (req, res) => {
  let reviewId = req.body.reviewId;
  let userId = req.body.id;
  let sql = `DELETE 
             FROM reviews
             WHERE reviewId = ${reviewId}`;
  let rows = await executeSQL(sql);
  res.redirect(`/userReviews?id=${userId}`)
});

// Allows users to add reviews
app.post('/addReview', isAuthenticated, isUser, async (req, res) => {
  let userId = req.body.id;
  let title = req.body.title;
  let rating = req.body.rating;
  let review = req.body.review;
  // If either one empty, then display error message and re-render
  if(title == "" || rating == "" || review == "")
  {
    userInfo = await getUserInfoById(userId);
    let sql = `SELECT *
               FROM reviews r
               INNER JOIN users u
               ON r.userId = u.userId`;
    let rows = await executeSQL(sql);
    // console.log(userInfo);
    res.render('userReviews', {"user": userInfo, "reviews": rows, "error": "Error: Fields Can't Be Empty"})
  }else{
    // Insert input to reviews table
    let sql = `INSERT INTO reviews
               (userId, description, rating, title)
               VALUES
               (?, ?, ?, ?)`;
    let rows = await executeSQL(sql, [userId, review, rating, title]);
    // redirect
    res.redirect(`/userReviews?id=${userId}`)
  }
});

async function getUserInfo(username) {
  let sql = `SELECT *
              FROM users
              WHERE username = ?`;
  let rows = await executeSQL(sql, [username]);
  return rows
}

async function getUserInfoById(userId) {
  let sql = `SELECT *
              FROM users
              WHERE userId = ?`;
  let rows = await executeSQL(sql, [userId]);
  return rows
}

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.render('home')
  }
}

function isUser(req, res, next) {
  if (req.session.currId == req.query.id || req.session.currId == req.body.id) {
    next();
  } else {
    res.send("ERROR: Cannot access page")
  }
}

app.get("/dbTest", async function(req, res) {
  let sql = "SELECT CURDATE()";
  let rows = await executeSQL(sql);
  res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}//executeSQL

//values in red must be updated
function dbConnection() {

  const pool = mysql.createPool({

    connectionLimit: 10,
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

  });

  return pool;

} //dbConnection

//start server
app.listen(3000, () => {
  console.log("Expresss server running...")
})

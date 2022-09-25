/**
 * Module dependencies.
 */
const express = require("express"),
  routes = require("./routes"),
  user = require("./routes/user"),
  path = require("path");

const https = require("https");
const fs = require("fs");
//const methodOverride = require('method-override');
const session = require("express-session");
const app = express();
const mysql = require("mysql");

let bodyParser = require("body-parser");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "K140790k@.",
  database: "teacher_stream",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

global.db = connection;

// all environments
app.set("port", process.env.PORT || 53);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// development only

app.get("/", routes.index); //call for main index page
app.get("/signup", user.signup); //call for signup page
app.post("/signup", user.signup); //call for signup post
app.get("/login", routes.index); //call for login page
app.post("/login", user.login); //call for login post
app.post("/remove", user.remove); //call for delete delete
app.get("/home/dashboard", user.dashboard); //call for dashboard page after login
app.get("/home/logout", user.logout); //call for logout
app.get("/home/profile", user.profile); //to render users profile
//Middleware
https
  .createServer(
    {
      key: fs.readFileSync("./geniusandcourage.com_key.pem"),
      cert: fs.readFileSync("./geniusandcourage.com_cert.pem"),
      passphrase: "",
    },
    app
  )
  .listen(53);

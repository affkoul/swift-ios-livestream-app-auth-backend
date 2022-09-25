//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;
    var email = post.email;
    var password = post.password;
    var username = post.username;

    var sql =
      "INSERT INTO `teacher_stream`(`email`,`password`,`name`) VALUES ('" +
      email +
      "','" +
      password +
      "','" +
      username +
      "')";
    var checkQuery = db.query(
      "SELECT email FROM teacher_stream WHERE email = '" + email + "'",
      function (err, results, field) {
        if (results.length === 0) {
          var query = db.query(sql, function (err, results) {
            message = "Your account has been created successfully";
            console.log(message);
            res.json({
              status: true,
              data: results,
              message: message,
            });
          });
        } else if (results.length > 0) {
          message = "User Exists";
          console.log(message);
          res.json({
            status: false,
            data: results,
            message: message,
          });
        }
      }
    );
  } else {
    // res.render('signup');
  }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
  var message = "";
  var sess = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var email = post.email;
    var password = post.password;

    var sql =
      "SELECT id, email, password, name FROM `teacher_stream` WHERE `email`='" +
      email +
      "' and password = '" +
      password +
      "'";

    var checkQuery = db.query(
      "SELECT email FROM teacher_stream WHERE email = '" + email + "'",
      function (err, results, field) {
        if (results.length === 0) {
          message = "User does not exists";
          console.log(message);
          res.json({
            status: false,
            data: results,
            message: message,
          });
        } else {
          db.query(sql, function (err, results) {
            if (results.length) {
              req.session.userId = results[0].id;
              req.session.user = results[0];
              console.log(results[0].id);
              message = "Login successful.";
              console.log(message);
              res.json({
                status: true,
                data: results,
                message: message,
              });
            } else {
              message = "Wrong Credentials.";
              console.log(message);
              res.json({
                status: false,
                message: message,
              });
            }
          });
        }
      }
    );
  } else {
    // res.render('index.ejs',{message: message});
  }
};
//-----------------------------------------------delete page functionality----------------------------------------------
exports.remove = function (req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;
    var email = post.email;
    var password = post.password;

    var sql = "DELETE FROM `teacher_stream` WHERE `email`='" + email + "'";

    var checkQuery = db.query(
      "SELECT email FROM teacher_stream WHERE email = '" + email + "'",
      function (err, results, field) {
        if (results.length === 0) {
          message = "User does not exists";
          console.log(message);
          res.json({
            status: false,
            data: results,
            message: message,
          });
        } else if (results.length > 0) {
          var query = db.query(sql, function (err, results) {
            message = "User successfully deleted";
            console.log(message);
            res.json({
              status: true,
              data: results,
              message: message,
            });
          });
        } else {
          message = "Failed to delete user. Try again.";
          console.log(message);
          res.json({
            status: false,
            message: message,
          });
        }
      }
    );
  } else {
    // stay where you are
  }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {
  var user = req.session.user,
    userId = req.session.userId;
  console.log("ddd=" + userId);
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

  db.query(sql, function (err, results) {
    res.render("dashboard.ejs", { user: user });
  });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/login");
  });
};
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, result) {
    res.render("profile.ejs", { data: result });
  });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, results) {
    res.render("edit_profile.ejs", { data: results });
  });
};

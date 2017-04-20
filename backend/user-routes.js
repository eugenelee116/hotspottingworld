var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    bcrypt  = require('bcryptjs'),
    db      = require('./db-connect');

var app = module.exports = express.Router();

function createToken(data) {
  return jwt.sign(_.omit(data, 'password'), config.secret, { expiresIn: 3600 });
}

/**
 * @api {post} /signup User Sign-Up
 * @apiName SignUpUser
 * @apiGroup Users
 *
 * @apiParam {String} email User email.
 * @apiParam {String} username User name.
 * @apiParam {String} password User password.
 *
 * @apiSuccess {json} id_token JSON authentication token.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQHIzYm9ybi5wdCIsInVzZXJuYW1lIjoiYWRtaW4iLCJpZCI6MjcsImlhdCI6MTQ0OTIyNTk5OCwiZXhwIjoxNDQ5MjI5NTk4fQ.n2unZjsMKa1Ym0s8qi2Lc4F17dL1d4amF_by6V0U4Fg"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "Email or username already exists!"
 *     }
 */
app.post('/signup', function(req, res) {
  var email     = req.body.email,
      username  = req.body.username,
      password  = req.body.password;

  if (!email || !username || !password) {
    return res.status(400).send("One or more fields are missing!");
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  db.pool.query("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [email, username, hash], function(err, results) {

    if(err){

      return res.status(400).send("Email or username already exists!");
    }

    var query = "SELECT u.*, (SELECT COUNT(*) FROM following o WHERE u.id_user=o.user_id) AS numfollowing, "
    +"(SELECT COUNT(*) FROM favourites a WHERE u.id_user=a.user_id) AS numfavourites "
    +"FROM users u, following o , favourites a WHERE u.id_user=? GROUP BY u.id_user";
    db.pool.query(query, [results.insertId], function(err, user) {

      var profile = _.pick(req.body, 'email', 'username');
      profile.userId = user[0].id_user;
      profile.fullname = user[0].fullname;
      profile.picture = user[0].profile_picture;
      profile.numfollowing = user[0].numfollowing;
      profile.numfavourites = user[0].numfavourites;

      res.status(201).send({
        id_token: createToken(profile)
      });

    });

  });

});

/**
 * @api {post} /login User Login
 * @apiName LoginUser
 * @apiGroup Users
 *
 * @apiParam {String} email User email.
 * @apiParam {String} password User password.
 *
 * @apiSuccess {json} id_token JSON authentication token.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQHIzYm9ybi5wdCIsInVzZXJuYW1lIjoiYWRtaW4iLCJpZCI6MjcsImlhdCI6MTQ0OTIyNTk5OCwiZXhwIjoxNDQ5MjI5NTk4fQ.n2unZjsMKa1Ym0s8qi2Lc4F17dL1d4amF_by6V0U4Fg"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "One or more fields are missing!",
 *       "The username or password don't match!"
 *     }
 */
app.post('/login', function(req, res) {
    var serverurl='http://'+req.headers.host;
  var email = req.body.email,
      password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("One or more fields are missing!");
  }

  var query = "SELECT u.*, (SELECT COUNT(*) FROM following o WHERE u.id_user=o.user_id) AS numfollowing, "
    +"(SELECT COUNT(*) FROM favourites a WHERE u.id_user=a.user_id) AS numfavourites "
    +"FROM users u, following o , favourites a WHERE u.email=? GROUP BY u.id_user";
  db.pool.query(query, [email], function(err, results) {

    if(err || results.length==0){
      return res.status(404).send("The email or password don't match");
    }

    var hash = results[0].password;

    if(!bcrypt.compareSync(password, hash)){
      return res.status(404).send("The email or password don't match!!");
    }

      var profile = _.pick(req.body, 'email');
      profile.userId = results[0].id_user;
      profile.username = results[0].username;
      profile.fullname = results[0].fullname;
      profile.picture = serverurl+'/'+results[0].profile_picture;;
      profile.numfollowing = results[0].numfollowing;
      profile.numfavourites = results[0].numfavourites;

    res.status(201).send({
      id_token: createToken(profile)
    });

  });

});

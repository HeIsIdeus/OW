var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');


// Render the registration page.
router.get('/register', function(req, res) {
  res.render('register', {title: 'Register', error: req.flash('error')[0]});
});

router.post('/register', function(req, res) {

  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    return res.render('register', {title: 'Register', error: 'Email and password required.'});
  }

  var apiKey = new stormpath.ApiKey(
    process.env['STORMPATH_API_KEY_ID'],
    process.env['STORMPATH_API_KEY_SECRET']
  );

  var spClient = new stormpath.Client({ apiKey: apiKey });

  var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
    if (err) throw err;

    app.createAccount({
      givenName: 'John',
      surname: 'Smith',
      username: username,
      email: username,
      password: password,
    }, function (err, createdAccount) {
      if (err) {
        return res.render('register', {title: 'Register', error: err.userMessage});
      } else {
        passport.authenticate('stormpath')(req, res, function () {
          return res.redirect('/dashboard');
        });
      }
    });
  });

});

router.get('/login', function(req, res) {
    res.render('login', {title: 'Login', error: req.flash('error')[0]});
});

router.post(
  '/login',
  passport.authenticate(
    'stormpath',
    {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.',
    }
  )
);

router.get('/logout', function(req, res) {
    req.logout();
      res.redirect('/');
});


module.exports = router;

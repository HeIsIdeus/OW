var express = require('express');
var router = express.Router();

//=========== This file holds all of the "main" website routes NOT auth related! ==================//

/*** req ("request") is an object containing information about the HTTP request that raised the event.
     In response to req, you use res ("response") to send back the desired HTTP response. Those
     parameters can be named anything. ***/

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home', user: req.user});
});

/* Render the DASHBOARD page */
router.get('/dashboard', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('dashboard', {title: 'Dashboard', user: req.user});
});

module.exports = router;

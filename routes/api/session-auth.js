// create a route that handles signin

function signin(req, res) {

  if (!req.body.username || !req.body.password) return res.json({ success: false });

  //Authentication. I knew the model did not need an authenticate method
  keystone.list('User').model.findOne({ email: req.body.username }).exec(function(err, user) {

    if (err || !user) {
      return res.json({
        success: false,
        session: false,
        message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
      });
    }

    //req.session.User = User.toAPI();

    keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {

      return res.json({
        success: true,
        session: true,
        date: new Date().getTime(),
        userId: user.id
      });

    }, function(err) {

      return res.json({
        success: true,
        session: false,
        message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
      });

    });

  });
}

// you'll want one for signout too
function signout(req, res) {
  keystone.session.signout(req, res, function() {
    res.json({ 'signedout': true });
  });
}

// also create some middleware that checks the current user

// as long as you're using Keystone's session management, the user
// will already be loaded if there is a valid current session
function checkAuth(req, res, next) {
  // you could check user permissions here too
  if (req.user) return next();
  return res.status(403).json({ 'error': 'no access' });
}





// the rest of your api endpoints go below here, e.g.
//app.get('/api/stuff', getStuff);

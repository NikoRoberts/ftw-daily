const passport = require('passport');
const passportFacebook = require('passport-facebook');
const { authWithIdp } = require('../../api-util/authentication');

const radix = 10;
const PORT = parseInt(process.env.REACT_APP_DEV_API_SERVER_PORT, radix);
const clientID = process.env.FACEBOOK_APP_ID;
const clientSecret = process.env.FACEBOOK_APP_SECRET;

const FacebookStrategy = passportFacebook.Strategy;

const callbackURL = `http://localhost:${PORT}/api/auth/facebook/callback`;

const strategyOptions = {
  clientID,
  clientSecret,
  callbackURL,
  profileFields: ['id', 'displayName', 'name', 'emails'],
};

const verifyCallback = (accessToken, refreshToken, profile, done) => {
  const { email } = profile._json;
  const userData = {
    email,
    accessToken,
    refreshToken,
  };

  done(null, userData);
};

passport.use(new FacebookStrategy(strategyOptions, verifyCallback));

exports.authenticateFacebook = passport.authenticate('facebook', { scope: ['email'] });

exports.authenticateFacebookCallback = (req, res, next) => {
  passport.authenticate('facebook', function(err, user, info) {
    authWithIdp(err, user, info, req, res, clientID);
  })(req, res, next);
};
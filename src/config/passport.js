/* eslint-disable function-paren-newline */
import passport from 'passport-jwt';

const opts = {
  jwtFromRequest: passport.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY,
};

export default new passport.Strategy(opts, (jwtPayload, done) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  done(null, jwtPayload),
);

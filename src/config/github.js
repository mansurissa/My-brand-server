import passport from 'passport-github2';
import User from '../models/usersModel.js';

const GithubStrategy = passport.Strategy;

export default new GithubStrategy(
  {
    clientID: 'c3a3186b68a075318c1f',
    clientSecret: '836bb1f17414b144ec51eb5d47036c6abf2795f1',
    callbackURL: 'http://localhost:5001/users/auth/github/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const { provider } = profile;
    const genUser = {
      name: profile._json.name,
      provider,
      password: 'TesterTester',
    };
    try {
      let user = await User.findOne(genUser);
      if (!user) {
        if (!profile._json.email) {
          genUser.email = `${profile.id}@${provider}.com`;
        } else genUser.email = profile._json.email;
        user = await User.create(genUser);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

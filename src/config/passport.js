import { Strategy as JwtStrategy, ExtractJwt  } from 'passport-jwt';


const opts = {
    wtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey = process.env.JWT_KEY
}

export default  new JwtStrategy(opts, (jwt_payload, done)=>  done(null, jwt_payload));

import passport from "passport";

export const auth = passport.authenticate("jwt", { session: false });
export const oAuth = {
  main: async (req, res, next) => {
    const { provider } = req.params;
    const config = { scope: "email" };
    if (provider === "github") config.scope = ["user:email"];
    if (provider === "google") config.scope = ["profile"];

    return passport.authenticate(provider, config)(req, res, next);
  },
  callback: async (req, res, next) => {
    const { provider } = req.params;
    passport.authenticate(provider, { session: false })(req, res, next);
  },
};

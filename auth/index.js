const router = require("express").Router();
const { User } = require("../db/models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",

            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ where: { username: username } });
                if (!user) {
                    return done(null, false, { message: "Incorrect username" });
                }
                if (!(await user.validatePassword(password))) {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// Mounted on /auth
router.post("/signup", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Required fields missing");
        }

        // new code to be added on, but since i add the unique limitation
        // in the db model, the following 2line of code are become 
        // unnecessary
        const check = await User.findOne({ where: { username: username } });
        if (check !== null) { throw new SequelizeUniqueConstraintError }

        const user = await User.create(req.body);

        // Passport js method on request
        req.login(user, (err) =>
            err ? next(err) : res.status(200).json({
                id: user.id, username: user.username, first_name: user.first_name,
                middle_name: user.middle_name, last_name: user.last_name
            })
        );
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(409).send("User already exists");
        } else {
            next(error);
        }
    }
});

router.post("/login", passport.authenticate("local"),
    function (req, res, next) {
        res.status(200).json({
            id: req.user.id,
            username: req.user.username,
            first_name: req.user.first_name,
            middle_name: req.user.middle_name,
            last_name: req.user.last_name,
        });
    }
);

// auth/logout
router.post("/logout", (req, res, next) => {
    // Passport js method on the request
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        res.redirect("/");
    });
});

// auth/me
router.post("/me", async (req, res, next) => {
    console.log(req)
    try {
        if (!req.user) {
            return;
        }
        const foundUser = await User.findOne({ where: { username: req.user.username } });
        res.status(200).json({
            id: foundUser.id, username: foundUser.username, first_name: foundUser.first_name,
            middle_name: foundUser.middle_name, last_name: foundUser.last_name
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
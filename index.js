const express = require("express");
const passport = require("passport");

const session = require("express-session");
require("./auth");
const app = express();

function isLoggedIn(req, res, next) {
	req?.user ? next() : res.sendStatus(401);
}

app.use(passport.initialize());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	}),
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: "/protected",
		failureRedirect: "/auth/google/failure",
	}),
);

app.get("/protected", isLoggedIn, (req, res) => {
	res.send(`Hello ${req.user.displayName}`);
});
app.get("/logout", (req, res) => {
	req.logout();
	req.session.destroy();
	res.send("Goodbye!");
});

app.get("/auth/google/failure", (req, res) => {
	res.send("Failed to authenticate..");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);

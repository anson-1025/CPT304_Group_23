const { urlencoded } = require("express");
const express = require("express");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();
require("../src/db/conn");
const views_path = path.join(__dirname, "../views");
const static_path = path.join(__dirname, "../static");
const app = express();
const port = process.env.PORT || 80;
const { body, validationResult } = require("express-validator");
const xss = require("xss");
const i18n = require("i18n");
const cookieParser = require("cookie-parser");

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'", "https://kit.fontawesome.com"],
                "style-src": [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                    "https://cdnjs.cloudflare.com"
                ],
                "font-src": [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "https://cdnjs.cloudflare.com"
                ],
                "img-src": ["'self'", "data:"],
            },
        },
        referrerPolicy: {
            policy: "strict-origin-when-cross-origin",
        },
    })
);


app.use("/static", express.static(static_path));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

i18n.configure({
    locales: ["en", "cn"],
    directory: path.join(__dirname, "../locales"),
    defaultLocale: "en",
    cookie: "lang",
    queryParameter: "lang",
    objectNotation: false
});

app.use(i18n.init);

app.use((req, res, next) => {
    const lang = req.query.lang || req.cookies.lang;

    if (lang && ["en", "cn"].includes(lang)) {
        res.setLocale(lang);
        res.cookie("lang", lang, {
            httpOnly: true,
            sameSite: "lax"
        });
    }

    res.locals.__ = res.__;
    res.locals.locale = res.getLocale();
    next();
});


app.set("view engine", "ejs");
app.set("views", views_path);

app.get("/", (req, res) => {
    res.status(200).render("index.ejs");
});

app.get("/signup", (req, res) => {
    res.status(200).render("signup.ejs", {
        errors: [],
        formData: {}
    });
});

app.post("/signup", [
    body("SignUpUsername").trim().notEmpty(),
    body("SignUpEmail").isEmail(),
    body("SignUpPassword").isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const translatedErrors = errors.array().map(err => {
            let key = "validation.username";
            if (err.path === "SignUpEmail") key = "validation.email";
            if (err.path === "SignUpPassword") key = "validation.password";
            return { msg: res.__(key) };
        });

        return res.status(400).render("signup.ejs", {
            errors: translatedErrors,
            formData: req.body
        });
    }

    const safeUsername = xss(req.body.SignUpUsername);
    const safeEmail = xss(req.body.SignUpEmail);

    res.send(`Registration Success! ${safeUsername} (${safeEmail})`);
});

// In Future this dashboard will be rendered after authentication of users 
app.get("/dashboard", (req, res) => {
    res.status(200).render("dashboard/dashboard.ejs");
});

app.get("/privacy", (req, res) => {
    res.status(200).render("privacy.ejs");
});




module.exports = app;
const { urlencoded } = require("express");
const express = require("express");
const path = require("path");
// ---  Member D newly added start ---
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const i18n = require('i18n');
const cookieParser = require('cookie-parser');
// --- Member D newly added end ---
require("dotenv").config();
require("../src/db/conn");
const views_path = path.join(__dirname, "../views");
const static_path = path.join(__dirname, "../static");
const app = express();
const port = process.env.PORT || 80;


app.use("/static", express.static(static_path));
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use(cookieParser());

// i18n internationalization configuration
i18n.configure({
    locales: ['en', 'cn'],
    directory: path.join(__dirname, '../locales'),
    defaultLocale: 'en',
    cookie: 'lang',
    queryParameter: 'lang',
    autoReload: true,
    updateFiles: false,
    objectNotation: true
});

app.use(cookieParser());
app.use(i18n.init);

app.use((req, res, next) => {
    const lang = req.query.lang;
    if (lang) {
        res.cookie('lang', lang);
    }
    res.locals.__ = res.__;
    res.locals.errors = [];
    next();
});

app.get("/", (req, res) => {
    res.render("index.ejs", { errors: [] });
});

// 2. 增加主页订阅 Email 的 POST 验证
app.post("/subscribe", [
    body('subscribeEmail').isEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("index.ejs", {
            errors: [{ msg: res.__('validation.home_email') }]
        });
    }
    res.send("Subscribed Successfully!");
});

// GET registration page
app.get("/signup", (req, res) => {
    res.status(200).render("signup.ejs", { errors: [] });
});

// POST Registration Handling: Add Input Validation
app.post("/signup", [
    body('SignUpUsername').trim().notEmpty(),
    body('SignUpEmail').isEmail(),
    body('SignUpPassword').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const translatedErrors = errors.array().map(err => {
            let key = 'validation.username';
            if (err.path === 'SignUpEmail') key = 'validation.email';
            if (err.path === 'SignUpPassword') key = 'validation.password';
            return { msg: res.__(key) };
        });

        return res.status(400).render("signup.ejs", {
            errors: translatedErrors,
            formData: req.body
        });
    }
    res.send("Registration Success!");
});

// Privacy Page Route
app.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
});

// In Future this dashboard will be rendered after authentication of users 
app.get("/dashboard", (req, res) => {
    res.status(200).render("dashboard/dashboard.ejs");
});

// Member D: Privacy Policy Route
app.get("/privacy", (req, res) => {
    res.status(200).render("privacy.ejs");
});


//* listen
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
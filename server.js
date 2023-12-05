// NPM MODULES
const express = require("express");
const { engine } = require('express-handlebars');
const session = require("express-session");
const app = express();

// LOCAL MODULES
const db = require('./utils/db');
const customError = require('./utils/customError');

const optionRouter = require('./routers/option.r');

//SETTING UP SERVER

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT | 3000;
const host = process.env.HOST || 'localhost';
const secret = "mysecretkey";

//app.use(express.urlencoded({ extended: true }))
//app.use(express.json());
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: secret,
        cookie: { secure: false },
    }),
);


// ROUTERS
app.use("", optionRouter);



// ERROR HANDLING
app.use((err, req, res, next) => {
    let statusCode = 500;
    if (err instanceof customError) {
        statusCode = err.statusCode;
    }

    res.status(statusCode).send(err.message);
});


// START SERVER
db.initDatabase().then(() => {
    app.listen(port, () => console.log(`Server is running at http://${host}:${port}`));
}).catch(err => {
    console.error(`Failed to initialize database: ${err}`);
});
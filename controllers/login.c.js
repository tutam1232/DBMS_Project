const db = require('../utils/db');

module.exports = {
    renderLoginChoice: async function renderLogin(req, res, next) {
        try {
            if(req.session.userType)
                res.redirect('/' + req.session.userType);


            res.render('loginChoice', { title: "Login Choice" });
        } catch (error) {
            next(error);
        }
    },
    renderLogin: async function renderLogin(req, res, next) {
        try {
            if(req.session.userType)
                res.redirect('/' + req.session.userType);


            const URL = req.originalUrl;
            const secondPart = URL.split('/')[2];
            const firstPart = URL.split('/')[1];
            let customer = false;
            if (secondPart === 'customer')
                customer = true;
            if(firstPart === 'login_lockConflict')
                req.session.resolve = false;
            if(firstPart === 'login_resolve_lockConflict')
                req.session.resolve = true;

            res.render('login', { title: "Login", customer: customer, URL: URL });
        } catch (error) {
            next(error);
        }
    },
    postLogin: async function postLogin(req, res, next) {
        try {
            const { username, password } = req.body;
            var config = {
                server: process.env.DB_HOST,
                database: process.env.DB_NAME,
                user: username,
                password: password,
                port: parseInt(process.env.DB_PORT),
                options: {
                    //trustedConnection: false,
                    trustServerCertificate: true
                }
            }

           const connection = await db.connectDatabase(config);
            req.session.connection = connection;    

            // await req.session.regenerate(function(err) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         // Store the user's information in the session
            //         req.session.user = username;

            //         const secondPart = req.originalUrl.split('/')[2];
            //         req.session.userType = secondPart;
            //         console.log('dang nhap dc roi!!!', req.session.userType);

            //         //res.redirect('/');
            //     }
            // });
            req.session.user = username;

            const secondPart = req.originalUrl.split('/')[2];
            req.session.userType = secondPart;
            console.log('dang nhap dc roi!!!', req.session.userType);//  
             
            res.redirect('/' + req.session.userType);
            //TODO: redirect to home page of staff
        } catch (error) {
            //console.log(error);
            res.render('login', { title: "login", validate: "is-invalid", error: "Invalid username or password", });
        }
    }
};
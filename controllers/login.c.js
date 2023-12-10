const loginM = require("../models/login.m");
const path=require('path');

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
            await loginM.postLogin(req, res, next);

            //kiem tra role
            const checkUserType = await loginM.checkUserType(req, res, next);
            console.log(checkUserType)
            if(checkUserType == 0){
                await loginM.logout(req, res, next);
                res.render('login', { title: "login", validate: "is-invalid", error: "Invalid User", });
            }


            res.redirect('/' + req.session.userType);           
            

        } catch (error) {
            //console.log(error);
            res.render('login', { title: "login", validate: "is-invalid", error: "Invalid username or password", });
        }
    },
    logout: async function logout(req, res, next) {
        try {
            await loginM.logout(req, res, next);
            
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }
};
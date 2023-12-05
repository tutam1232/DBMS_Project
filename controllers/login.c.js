module.exports = {
    renderLogin: async function renderLogin(req, res, next) {
        try {
            res.render('login',{title: "Login"});
        } catch (error) {
            next(error);
        }
    },
};
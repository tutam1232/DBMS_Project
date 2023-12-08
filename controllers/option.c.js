const customError = require('../utils/customError')

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        try {
            if(req.session.userType)
                res.redirect('/' + req.session.userType);
            //console.log(req.session)
            res.render('option',{title: "Option"});
        } catch (error) {
            next(error);
        }
    },
}
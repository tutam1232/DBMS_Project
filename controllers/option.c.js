const customError = require('../utils/customError')

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        try {
            console.log(req.session.user)
            res.render('option',{title: "Option"});
        } catch (error) {
            next(error);
        }
    },
}
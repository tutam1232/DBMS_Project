const customError = require('../utils/customError')

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        try {
            res.render('option',{title: "Option"});
        } catch (error) {
            next(error);
        }
    },
}
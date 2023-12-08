module.exports = {
    renderOption: async function renderOption(req, res, next) {
        if(!req.session.user)
            res.redirect('/');
        res.render("doctor/option", {
            title: "Doctor Option",
        });
    }
}
module.exports = {

    addAppointment: async function (req, res, next) {
        if(!req.session.connection)
            return;
    },

}
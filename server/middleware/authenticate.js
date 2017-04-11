var { User } = require('./../models/user');
var authenticate = (req, res, next) => {
    var token = req.header('x-auth') || (req.headers.cookie).split("=")[1].split(';')[0]
    // console.log((req.headers.cookie).split("=")[1].split(';')[0]);
    User.findByToken(token).then((user) => {
        if (!user) {
            res.status(400).send();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(404).send()
    })
}
module.exports = { authenticate }
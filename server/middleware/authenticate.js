var { User } = require('./../models/user');
var authenticate = (req, res, next) => {
    var token = req.header('x-auth')
    console.log(token)
    
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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
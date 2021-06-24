const User = require('../models/user.model')
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authToken = req.headers['token']
    if (authToken) {
        jwt.verify(authToken, process.env.SECRETKEY, (err, user) => {
            if (err) {
                res.status(403).send({
                    status: 403,
                    message: "Error while jwt verification."
                })
            }

            req.user = user
            next()

        })
    } else {
        res.status(401).send({
            status: 401,
            message: "Not allowed."
        })
    }
}
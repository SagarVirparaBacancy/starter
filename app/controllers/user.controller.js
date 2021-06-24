const User = require('../models/user.model')
const jwt = require('jsonwebtoken');

var crypto = require('crypto'), algorithm = 'aes-256-ctr', secretKey = process.env.SECRETKEY;

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, secretKey)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, secretKey)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


// create new user
exports.createUser = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty"
        });
    }

    try {
        const isEmailExistsData = await User.findOne({ email: req.body.email }).lean()

        if (isEmailExistsData) {
            return res.status(409).send({
                status: 409,
                message: "User already exists with this email."
            })
        } else {

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: encrypt(req.body.password),
                pic: req.file.filename,
                userType: req.body.userType
            });

            // Save in the database
            user.save()
                .then(data => {
                    res.status(200).send({
                        status: 200,
                        message: "Created successfully.",
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating."
                    });
                });

        }

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating."
        });
    }

}

exports.updateUser = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty"
        });
    }

    User.findByIdAndUpdate(req.params.userId, {
        name: req.body.name,
        email: req.body.email
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: 404,
                    message: "User not found."
                });
            }
            res.send({
                status: 200,
                message: "Updated successfully.",
                data: user
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: "Error updating."
            });
        });
}

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: 404,
                    message: "User not found."
                });
            }
            return res.send({
                status: 200,
                message: "Deleted successfully.",
                data: user
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: "Error deleteing."
            });
        });
}

exports.findUserById = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: 404,
                    message: "User not found."
                });
            }
            return res.send({
                status: 200,
                message: "Fetched successfully.",
                data: user
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: "Error finding."
            });
        });
}

exports.getAllUser = (req, res) => {

    User.find().then(data => {
        return res.status(200).send({
            status: 200,
            message: "Fetched successfully.",
            data: data
        })
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occurred while creating."
        });
    })
}

exports.login = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty"
        });
    }

    try {
        let fetchedUserData = await User.findOne({ email: req.body.email }).lean()
        if (fetchedUserData) {
            if (req.body.password == decrypt(fetchedUserData.password)) {

                jwt.sign({
                    data: fetchedUserData
                }, secretKey, { expiresIn: '1d' }, (err, token) => {
                    fetchedUserData['token'] = token
                    return res.status(200).send({
                        status: 200,
                        message: "Login successfully,",
                        data: fetchedUserData
                    })
                })

            } else {
                return res.status(400).send({
                    status: 400,
                    message: "Password is wrong."
                })
            }
        } else {
            return res.status(404).send({
                status: 404,
                message: "User not found."
            })
        }
    } catch (err) {
        return res.status(500).send({
            message: err.message || "Some error occurred."
        });
    }

}


exports.googleLogin = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty"
        });
    }

    try {
        let fetchedUserData = await User.findOne({ socialid: req.body.socialid, provider: req.body.provider }).lean()
        // check if user has logged first time
        if (fetchedUserData) {

            jwt.sign({
                data: fetchedUserData
            }, secretKey, { expiresIn: '1d' }, (err, token) => {
                fetchedUserData['token'] = token
                return res.status(200).send({
                    status: 200,
                    message: "Login successfully,",
                    data: fetchedUserData
                })
            })

        } else {
            // insert new google login user
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                userType: 'user',
                socialid: req.body.socialid,
                provider: req.body.provider
            });

            // Save in the database
            user.save()
                .then(data => {

                    jwt.sign({
                        data: fetchedUserData
                    }, secretKey, { expiresIn: '1d' }, (err, token) => {
                        fetchedUserData['token'] = token
                        return res.status(200).send({
                            status: 200,
                            message: "Login successfully,",
                            data: fetchedUserData
                        })
                    })

                }).catch(err => {
                    return res.status(500).send({
                        message: err.message || "Some error occurred while creating."
                    });
                });
        }
    } catch (err) {
        return res.status(500).send({
            message: err.message || "Some error occurred."
        });
    }

}


// google social login
// receive - id, provider, name, email
// insert socialid, provider, name, email
// generate jwt token and return
// check if the user with same id exists then generate jwt token and return
// else insert data and generate token
// save authtoken in local
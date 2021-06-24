module.exports = (app) => {
    const usersController = require('../controllers/user.controller.js');
    const middleware = require('../middleware/auth.middleware')

    const multer = require('multer')
    let upload = multer({ dest: 'uploads/' })

    // user middleware
    app.use('/user', middleware.authenticateToken)

    // Create a new user
    app.post('/auth/createUser', upload.single('pic'), usersController.createUser);

    // login
    app.post('/auth/login', usersController.login)

    // Retrieve all users
    app.get('/user/getAllUser', usersController.getAllUser);

    // update
    app.put('/user/:userId', usersController.updateUser)

    // delete
    app.delete('/user/:userId', usersController.deleteUser)

    // find user by id
    app.get('/user/:userId', usersController.findUserById)

    // google login
    app.post('/auth/googleLogin', usersController.googleLogin)
}
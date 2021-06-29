module.exports = (app) => {
    const usersController = require('../controllers/user.controller.js');
    const navigationController = require('../controllers/rolepermission.controller')
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

    // datatable
    app.post('/user/getUserForDT', usersController.getAllUserForDT)


    // Navigation routes start
    app.get('/auth/fetchAllNavigation', navigationController.fetchAllNavigation)
    app.post('/auth/insertNewNavigation', navigationController.insertNewNavigation)
    app.get('/auth/nav/:navId', navigationController.findNavigationById)
    app.put('/auth/nav/:navId', navigationController.updateNavigation)
    app.delete('/auth/nav/:navId', navigationController.deleteNavigation)

    // premission
    app.post('/auth/permission/insertNewPermission', navigationController.insertNewPermission)
    app.get('/auth/permission/fetchAllPermission', navigationController.fetchAllPermission)
    app.get('/auth/permission/:permissionId', navigationController.findPermissionById)
    app.delete('/auth/permission/:permissionId', navigationController.deletePermission)
    app.put('/auth/permission/:permissionId', navigationController.updatePermission)
    

}
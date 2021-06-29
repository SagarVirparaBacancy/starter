const Navigation = require('../models/navigation.model')
const UserPermission = require('../models/userpermission.model')

const mongoose = require("mongoose")

exports.fetchAllNavigation = async (req, res) => {

    try {
        let fetchedNavigationList = await Navigation.find()
        if (fetchedNavigationList) {
            return res.status(200).send({
                status: 200,
                message: "Fetched successfully.",
                data: fetchedNavigationList
            })
        } else {
            return res.status(404).send({
                status: 200,
                message: "Navigation not found."
            })
        }
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while creating."
        });
    }

}

exports.insertNewNavigation = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty."
        });
    }

    try {
        const navigation = new Navigation({
            name: req.body.name,
            displayName: req.body.displayName,
            routeName: req.body.routeName,
            icon: req.body.icon,
            order: req.body.order,
            isSub: req.body.isSub,
            parent: req.body.parent
        }).save()

        navigation.then(data => {
            if (data) {
                return res.status(201).send({
                    status: 201,
                    message: "Navigation created successfully.",
                    data: data
                })
            } else {
                return res.status(422).send({
                    status: 422,
                    message: "Not able to process entity."
                })
            }
        }).catch(err => {
            return res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while creating."
            });
        })

    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while creating."
        });
    }

}


exports.findNavigationById = async (req, res) => {

    try {
        const fetchedNavigation = await Navigation.findById(req.params.navId)
        if (!fetchedNavigation) {
            return res.status(404).send({
                status: 404,
                message: "Navigation not found."
            })
        }
        return res.status(200).send({
            status: 200,
            message: "Navigation fetched successfully.",
            data: fetchedNavigation
        })

    } catch (err) {
        // console.log(err)
        return res.status(500).send({
            status: 500,
            message: "Something went wrong."
        })
    }

}


exports.updateNavigation = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty."
        });
    }

    Navigation.findByIdAndUpdate(req.params.navId, {
        name: req.body.name,
        displayName: req.body.displayName,
        routeName: req.body.routeName,
        icon: req.body.icon,
        order: req.body.order,
        isSub: req.body.isSub,
        parent: req.body.parent
    }, { new: true })
        .then(nav => {
            if (!nav) {
                return res.status(404).send({
                    status: 404,
                    message: "Navigation not found."
                });
            }
            res.send({
                status: 200,
                message: "Updated successfully.",
                data: nav
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Error updating."
            });
        });
}

exports.deleteNavigation = (req, res) => {
    Navigation.findByIdAndRemove(req.params.navId)
        .then(nav => {
            if (!nav) {
                return res.status(404).send({
                    status: 404,
                    message: "Navigation not found."
                });
            }
            return res.send({
                status: 200,
                message: "Deleted successfully.",
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Error deleting."
            });
        });
}


exports.insertNewPermission = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty."
        });
    }

    try {

        let splitedNavIds = req.body.navId.split(",")
        let navIdsToBeInserted = splitedNavIds.map( x => mongoose.Types.ObjectId(x) )

        const userPermission = new UserPermission({
            userId: req.body.userId,
            navId: navIdsToBeInserted,
            navPermission: req.body.navPermission
        }).save()

        userPermission.then(data => {
            if (data) {
                return res.status(201).send({
                    status: 201,
                    message: "Permission created successfully.",
                    data: data
                })
            } else {
                return res.status(422).send({
                    status: 422,
                    message: "Not able to process entity."
                })
            }
        }).catch(err => {
            return res.status(500).send({
                status: 500,
                message: err.message || "Some error occurred while creating."
            });
        })

    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while creating."
        });
    }

}

exports.fetchAllPermission = async (req, res) => {

    try {
        let fetchPermissionList = await UserPermission.find()
        if (fetchPermissionList) {
            return res.status(200).send({
                status: 200,
                message: "Permission successfully.",
                data: fetchPermissionList
            })
        } else {
            return res.status(404).send({
                status: 200,
                message: "Permission not found."
            })
        }
    } catch (err) {
        return res.status(500).send({
            status: 500,
            message: err.message || "Some error occurred while creating."
        });
    }

}

exports.findPermissionById = async (req, res) => {

    try {
        const fetchPermission = await UserPermission.findById(req.params.permissionId)
        if (!fetchPermission) {
            return res.status(404).send({
                status: 404,
                message: "Permission not found."
            })
        }
        return res.status(200).send({
            status: 200,
            message: "Permission fetched successfully.",
            data: fetchPermission
        })

    } catch (err) {
        // console.log(err)
        return res.status(500).send({
            status: 500,
            message: "Something went wrong."
        })
    }

}

exports.deletePermission = (req, res) => {
    UserPermission.findByIdAndRemove(req.params.permissionId)
        .then(permission => {
            if (!permission) {
                return res.status(404).send({
                    status: 404,
                    message: "Permission not found."
                });
            }
            return res.send({
                status: 200,
                message: "Deleted successfully.",
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Error deleting."
            });
        });
}

exports.updatePermission = async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            message: "Data can not be empty."
        });
    }

    UserPermission.findByIdAndUpdate(req.params.permissionId, {
        userId: req.body.userId,
        navId: req.body.navId,
        navPermission: req.body.navPermission
    }, { new: true })
        .then(permission => {
            if (!permission) {
                return res.status(404).send({
                    status: 404,
                    message: "Permission not found."
                });
            }
            res.send({
                status: 200,
                message: "Permission updated successfully.",
                data: permission
            });
        }).catch(err => {
            res.status(500).send({
                status: 500,
                message: err.message || "Error updating."
            });
        });
}
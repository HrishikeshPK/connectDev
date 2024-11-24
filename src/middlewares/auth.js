const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked!!!")
    const token = "xyz"
    const isAdminAuthorised = token === "xysz"
    if (!isAdminAuthorised){
        res.status(401).send("UnAuthorised request")
    }
    else {
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log("user auth is getting checked!!!")
    const token = "xyz"
    const isUserAuthorised = token === "xyz"
    if (!isUserAuthorised){
        res.status(401).send("UnAuthorised request")
    }
    else {
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}
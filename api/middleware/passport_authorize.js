
    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
module.exports = (req, res, next) => {

    //  To place all (or most) of passport options here!
    console.log("middleware working");
    next();

}
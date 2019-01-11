
module.exports = (req, res, next) => {
    console.log(req.session);
    if (!req.session.userId) return res.status(403).json({message: 'unauthorized'});    //  To place all (or most) of passport options here!
    console.log("access granted");
    next();

}
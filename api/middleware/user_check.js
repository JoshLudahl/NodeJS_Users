
module.exports = (req, res, next) => {

    if (!(req.session.userId && req.session)) return res.status(403).json({message: 'unauthorized'})   //  To place all (or most) of passport options here!
    console.log("access granted");
    next();

}
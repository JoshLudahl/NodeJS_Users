//  Check if session established and if user has logged in by it signing their userId (_id)
module.exports = (req, res, next) => {
    if (!(req.session.userId && req.session)) return res.status(404).json({message: "nope"});
        console.log("access granted");
    next();
}
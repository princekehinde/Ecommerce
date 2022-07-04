const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) res.status(403).json( 'Invalid token' );
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json('Access denied')
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, async () => {
        if(req.user.id === req.params._id || req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json('Access denied for this user')
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, async () => {
        if( req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json('Access denied for this user')
        }
    })
}
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }

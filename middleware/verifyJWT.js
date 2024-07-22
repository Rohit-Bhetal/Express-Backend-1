const jwt= require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded) =>{
            if(err) return res.sendStatus(403); //invalid Token
            req.user = decoded.username;
            req.roles = decoded.roles
            next();

        }
    );
}

module.exports = verifyJWT

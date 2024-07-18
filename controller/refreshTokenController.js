const userDB = {
    users: require('../model/user.json'),
    setUsers :function(newUser){this.users=newUser}
}



const jwt= require('jsonwebtoken');
require('dotenv').config();


const handleRefreshToken = async (req,res)=>{
    const cookies = req.cookies;
    console.log(cookies);
    if(!cookies?.jwt) return res.status(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    const foundUser=userDB.users.find(person=>person.refreshToken===refreshToken);
    if(!foundUser) return res.status(403);
    //evaluate password

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded) =>{
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken =jwt.sign(
                {
                    "username":decoded.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'30s'}
            );
            res.json({
                accessToken
            })
        }
        
    )
        
}

module.exports = {handleRefreshToken};
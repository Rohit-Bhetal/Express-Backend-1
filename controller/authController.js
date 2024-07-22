const User = require('../model/User');


const bcyrpt= require('bcrypt');

const jwt= require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req,res)=>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({
        'message':"Username and password are required."
    });
    const foundUser=User.findOne({
        username:user
    }).exec;
    if(!foundUser) return res.status(404).json({
        'error':'Username not found'
    });
    //evaluate password
    const match =await bcyrpt.compare(pwd,foundUser.password);
    if(match){
        const roles= Object.values(foundUser.roles);
        //create JWT 
        const accessToken = jwt.sign(
            {"username": foundUser.username,
                "roles":roles
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:'30s'
            }

        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:'1d'
            }

        );
        foundUser.refreshToken = refreshToken;
        //await foundUser.save();
        res.cookie('jwt',refreshToken,{httpOnly: true,sameSite:'None',secure:true, maxAge : 24*60*6*1000});
        res.json({ accessToken });
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
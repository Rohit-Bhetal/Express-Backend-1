const User = require('../model/User');
require('dotenv').config;


const logoutHandler = async(req,res)=>{
    //onClient,also delete the accessToken
    
    const cookies = req.cookies;
    console.log(cookies);
    if(!cookies?.jwt) return res.sendStatus(204); //No Content
    const refreshToken = cookies.jwt;
    //Is refreshToken in db?
    const foundUser=User.findOne({
        refreshToken
    }).exec();
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
        return res.status(204);
    }
  
    //Delete refreshToken in db
    foundUser.refreshToken='';
    const result=await foundUser.save();
    console.log(result);

    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true}) //secure :true -only servers on https use in production


    res.sendStatus(204);
        
}

module.exports = {logoutHandler};
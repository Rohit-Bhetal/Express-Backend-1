const userDB = {
    users: require('../model/user.json'),
    setUsers :function(newUser){this.users=newUser}
}

const bcyrpt= require('bcrypt');

const jwt= require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req,res)=>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({
        'message':"Username and password are required."
    });
    const foundUser=userDB.users.find(person=>person.username===user);
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
        const otherUsers = userDB.users.filter(person=>person.username !== foundUser.username);
        const currentUser = {...foundUser,refreshToken};

        userDB.setUsers([...otherUsers,currentUser]);
        await fsPromises.writeFile(path.join(__dirname,'..','model','user.json'),JSON.stringify(userDB.users,null,2))
        res.cookie('jwt',refreshToken,{httpOnly: true,sameSite:'None',secure:true, maxAge : 24*60*6*1000});
        res.json({ accessToken });
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
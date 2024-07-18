const userDB = {
    users: require('../model/user.json'),
    setUsers :function(newUser){this.users=newUser}
}


const fsPromises= require('fs').promises;
const path = require('path');


const logoutHandler = async (req,res)=>{
    //onClient,also delete the accessToken
    
    const cookies = req.cookies;
    console.log(cookies);
    if(!cookies?.jwt) return res.sendStatus(204); //No Content
    const refreshToken = cookies.jwt;
    //Is refreshToken in db?
    const foundUser=userDB.users.find(person=>person.refreshToken===refreshToken);
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true})
        return res.status(204);
    }
    //evaluate password

    //Delete refreshToken in db
    const otherUsers = userDB.users.filter(person=>person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser,refreshToken:''};
    userDB.setUsers([...otherUsers,currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','user.json')
    )
        
}

module.exports = {handleRefreshToken};
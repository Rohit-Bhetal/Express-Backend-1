const userDB = {
    users: require('../model/user.json'),
    setUsers :function(newUser){this.users=newUser}
}

const fsPromises =require('fs').promises;
const path = require('path');
const bcyrpt= require('bcrypt');

const handleNewUser = async (req,res) =>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({
        'message':"Username and password are required."
    });
    // check for duplicate username in the db
    const duplicate = userDB.users.find(person=>person.username===user);
    if(duplicate) return res.status(409).json({ 'message': "Username already exists." });;
    try {
        const hashedPwd = await bcyrpt.hash(pwd,10);
        //store the new user
        const newUser = { "username":user,"password":hashedPwd};
        const updatedUsers = [...userDB.users, newUser];
        userDB.setUsers(updatedUsers);
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','user.json'),
            JSON.stringify(userDB.users,null,2)
        );

        console.log(userDB.users);
        res.status(201).json({'success':`New user ${user} created!`})

    } catch (error) {
        res.status(500).json({
            "error":error.message
        })
    }
}

module.exports = {handleNewUser};
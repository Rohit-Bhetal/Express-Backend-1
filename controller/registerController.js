const User = require('../model/User');
const bcyrpt= require('bcrypt');
require('dotenv').config;
const handleNewUser = async (req,res) =>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({
        'message':"Username and password are required."
    });
    // check for duplicate username in the db
    const duplicate = await User.findOne({
        username:user
    }).exec();
    if(duplicate) return res.status(409).json({ 'message': "Username already exists." });
    try {
        const hashedPwd = await bcyrpt.hash(pwd,10);
        //store the new user
        const result = await User.create(
            { "username":user,
                "password":hashedPwd}
        );
        
            
        console.log(result);

        
        res.status(201).json({'success':`New user ${user} created!`})

    } catch (error) {
        res.status(500).json({
            "error":error.message
        })
    }
}

module.exports = {handleNewUser};
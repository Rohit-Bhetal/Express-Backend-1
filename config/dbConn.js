const mongoose = require('mongoose');
require('dotenv').config;
const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
    } catch (error) {
        console.error(error);
    }
}
module.exports = connectDB;
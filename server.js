const express = require("express");
const app = express();
const path= require('path');
const PORT=3030;
const logEvents = require('./middleware/logEvents');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors=require('cors');
const corsOptions=require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credential");
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');


//connect to mongoDB
connectDB();
//Custom Middlewares

app.use(logger);

//Cross -Origin Resources Sharing
app.use(credentials)
app.use(cors(corsOptions));


// Error handling middleware to handle CORS errors

//Midlleware BUILT_IN

app.use(express.urlencoded({extended:false}));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//built serve static files

app.use(express.static(path.join(__dirname,'/public')));

app.use('/subdir',express.static(path.join(__dirname,'/public')));

//routes
app.use('/subdir',require('./routes/subdir'));
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/login',require('./routes/auth')); // Use Credential Flags 
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees'));
//app.use('/employees',require('./routes/api/employees'))


// Route handlers
app.get('/headers',(req,res)=>{
    res.type('text/plain')
    const headers = Object.entries(req.headers).map(
        ([key,value])=> `${key}: ${value}`
    )
    res.send(headers.join('\n'))
});

app.get('/hello(.html)?',(req,res,next) =>{
    console.log('attempted to load hello.html');
    next();
},(req,res)=>{
    res.send('Hello world!')
});


const one= (req,res,next)=>{
    console.log("First");
    next();
}
const two= (req,res,next)=>{
    console.log("Second");
    next();
}
const three= (req,res)=>{
    console.log("Third");
    res.send('Finished');
}

app.get('/chain(.html)?',[one,two,three]);



//app.use('/)

app.all('/*',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile('./views/404.html',{
            root:__dirname
            
        })
    }
    else if(req.accepts('json')){
        res.json({error:"404 Not Found"})
    }
    else{
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);
app.use((err, req, res, next) => {
    if (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message} );
    } else {
        next();
    }
});

mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT,'127.0.0.1',()=>{
        console.log(`Listening to port:${PORT}`);
    });
    
});



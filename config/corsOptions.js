
const allowedOrigins=['https://www.google.com/',`http://127.0.0.1:5500`,'http://localhost:3030/'];
const corsOptions = {
    origin:(origin,callback)=>{
        console.log(origin);
        if(!origin||allowedOrigins.indexOf(origin) !== -1){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by cors'));
        }
    },
    optionsSuccessStatus :200
    
}

module.exports={
    allowedOrigins,
    corsOptions
};
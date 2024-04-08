const express = require("express");
const morgan = require("morgan");
const createError = require('http-errors');
const bodyParser = require('body-parser');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');


const app = express();


app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(rateLimit());

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100, //
    message: 'Too many requests, please try again later.'
	
});

const isLoggedIn = (req, res,next) => {
    const login = true;
    if(login) {
        req.body.id =1;
        next();
    } else {

       return res.status(401).send({
            "message":"you are not logged in"
        });
    }
}

app.get('/',(req, res) => {
    res.send('welcome to the server');
})

app.get('/products',(req,res)=>{
    res.status(200).send({
        "message":"products are  returned successfully"
    });
})

app.get("/api/users",isLoggedIn,(req,res)=>{
    console.log(req.body.id);
    console.log("user profile");
    res.status(200).send({
        "message":"users are  returned successfully"
    });
})


//clinet error handling
app.use((req, res, next) => {
   //res.status(400).json({ message:'route not found'})
  
    next(createError(404,'route not found'));
});


// server error handling
app.use((err, req, res, next) => {
    //console.error(err.stack);
   // res.status(500).send("something went wrong")
    res.status(500).json({
        success: false,
        message:err.message
    })
 
//    return res.status(err.status || 500).json({
//     success: false,
//     message:err.message
//    })

});


module.exports = app;
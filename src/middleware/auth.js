const jwt = require("jsonwebtoken");
const Register = require("../models/registers");


//Get Token key from cookies
const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET)
        console.log(verifyUser) //Output format  { _id: '65526114759d82e4e54ba128', iat: 1699942104 }
        console.log("Auth Token ...Loading...====>   " + token)
       

        const user=await Register.findOne({_id:verifyUser._id});
        console.log(user);
        req.token=token
        // vikas=token          //you can use this line instead of req.token=token
        console.log()
        req.user=user
        next();
    }catch(e){
        res.status(400).send(e);
    }
}

module.exports=auth;
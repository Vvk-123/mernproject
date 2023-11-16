require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser')
const auth=require('./middleware/auth')

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");  //dt
const { log } = require("console");    //dt

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" );  //css file
const template_path = path.join(__dirname, "../templates/views" );  // hbs files
const partials_path = path.join(__dirname, "../templates/partials" );  //partial hbs files

app.use(express.json());    // used for req.body
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));   // used for req.body

app.use(express.static(static_path)); 
app.set("view engine", "hbs");
app.set("views", template_path);  //defined views folder inside the templates folder
hbs.registerPartials(partials_path);

console.log(process.env.SECRET);


app.get("/", (req, res) => {
    res.render("index")
});

app.get("/secret",auth, (req, res) => {
    console.log(`the awesome the secret key is ${req.cookies.jwt}`)
    res.render("secret")
});


// Logout using clear cokkies method 

// app.get("/logout",auth, async(req, res) => {
//     try{
//      res.clearCookie("jwt")
//      console.log(`the awesome the secret key is ${req.cookies.jwt}`)
//      await req.user.save();
//      res.render("login")
// }catch(e){
//     res.status(400).send(e)
// }});


// logout from only select tokens
app.get("/logout",auth, async(req, res) => {


    try{

        
        //logout from only select tokens
        req.user.tokens=req.user.tokens.filter((currelement)=>{
            return currelement.token != req.token           
            // return currelement.token != vikas          //you can use this line instead of above line
        })



        // Logout from all devices
        // req.user.tokens=[]

        res.clearCookie("jwt")
        console.log(`the awesome the secret key is ${req.cookies.jwt}`)
        await req.user.save();
        res.render("login")
}catch(e){
    res.status(400).send(e)
}});
    

app.get("/register", (req, res) =>{
    res.render("register");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

// create a new user in our database
app.post("/register", async (req, res) =>{
    try {

      const password = req.body.password;
      const cpassword = req.body.confirmpassword;
    //   console.log("Register data is loading.....=====>>>  "+req.body);

      if(password === cpassword){
        
        const registerEmployee = new Register(
                // firstname: req.body.firstname,
                // lastname:req.body.lastname,
                // email:req.body.email,
                // gender:req.body.gender,
                // phone:req.body.phone,
                // age:req.body.age,
                // password:req.body.password,
                // confirmpassword:req.body.confirmpassword    
                req.body    //either use above or this line code ,when use above code please include curly brasis
      )

        console.log("the success part" + registerEmployee);

        // Generate Token generateAuthToken() this function defined in the registers.js page
        const token = await registerEmployee.generateAuthToken();
        console.log("the token part  💘 " + token);

        //To set the cookie name & value for Registration time
        res.cookie("jwt",token,{
        expires:new Date(Date.now()+500000)})


        // save into the Database
        const registered = await registerEmployee.save();
        console.log("the page part " + registered);
        res.status(201).render("index");

      }else{
          res.send("password are not matching")
      }
        
    } catch (error) {
        res.status(400).send(`{error}`);
        //res.status(400).send("Already Register this data");
        console.log("the error part page ");
        //console.log("Already Register this data ");
    }
})


// login check with bcrypt when using bcrypt login method pllease uncomment "converting password into hash" in registers.js page"

app.post("/login", async(req, res) =>{
   try {
    
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});


        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part ...Loading ...=====> " + token);
        
        //To set the cookie name & value for Login time
        res.cookie("jwt",token,{
        expires:new Date(Date.now()+50000)})
    
       
        if(isMatch){
            res.status(201).render("index");
        }else{
           res.send("invalid Password Details"); 
        }
    
   } catch (error) {
       res.status(400).send("invalid login Details")
   }
})




//login check Without bcript comment Above bcript code and hash password in registers.js

// app.post("/login", async(req, res) =>{
//     try {
     
//          const email = req.body.email;
//          const password = req.body.password;
 
//          const useremail = await Register.findOne({email:email});
 
//         //console.log(useremail.password);
        
//          if(useremail.password==password){
//              res.status(201).render("index");
//          }else{
//             res.send("invalid Password Details"); 
//          }
     
//     } catch (error) {
//         res.status(400).send("invalid login Details")
//     }
//  })
 







// const bcrypt = require("bcryptjs");

// const securePassword = async (password) =>{

//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordmatch = await bcrypt.compare("thapa@123", passwordHash);
//     console.log(passwordmatch);

// }

// securePassword("thapa@123");


// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({_id:"5fb86aaf569ea945f8bcd2e1"}, "mynameisvikaskulkarniandiamfromislampur", {
//         expiresIn:"2 seconds"
//     });
//     console.log(token);

//     const userVer = await jwt.verify(token, "mynameisvikaskulkarniandiamfromislampur");
//     console.log(userVer);
// }


// createToken();


// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }


app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})


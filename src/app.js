require('dotenv').config();
const express = require("express");
// const async = require("hbs/lib/async");
const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcryptjs");
const app = express();
require("./db/conn");
const Register =require("./models/register");

const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({extended:false}));// for getting form data


const mainpath = path.join(__dirname,"../public");
// const viewpath = path.join(__dirname,"../views");

app.set("view engine", "ejs")
// app.set("views",viewpath)

// app.use("/",express.static(mainpath));
// app.use("/register",express.static(mainpath));
// app.use("/login",express.static(mainpath));


app.get("/home",(req,resp)=>{
    // resp.send("hi i am shlok")
    resp.render("home")
});
// for home page
// app.get("/",(req,resp)=>{
//     // resp.send("hi i am shlok")
//     resp.render("")
// });

// for registration form
app.get("/register",(req,resp)=>{
    // resp.send("hi i am shlok")
    resp.render("register")
});
app.post("/register",async(req,resp)=>{
    // resp.send("hi i am shlok")
    try {
       const  password= req.body.password;
       const confirmpassword = req.body.confirmpassword;
       if(password === confirmpassword){
        const user = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            // gender:req.body.gender,
            phone:req.body.phone,
            password:password,
            confirmpassword:confirmpassword
            
        })
        console.log("success" + user);
        const token = await user.generateAuthToken();// here user is instance of Register model
        console.log("the part of "+ token)

        const data = await user.save();
        resp.status(201).render("home");
        // resp.status(200).render("index")
        // console.log(data);

       }else{
        resp.status(500).json("Password are matching")
       }
       
        // console.log(req.body.firstname);
        // resp.send(data);
    } catch (error) {
        resp.status(500).json(error);
        console.log(error)
    }
});

// for login forms
app.get("/login",(req,resp)=>{
    // resp.send("hi i am shlok")
    resp.render("login")
});
app.post("/login",async(req,resp)=>{
    try {
        const email = req.body.email;
    const password = req.body.password;
    const match = await Register.findOne({email:email});
    // bcrypt ke ange yadi await use na kaare too bhi yah work karta hai per proper rule me await use kare it's best.
    const isMatch = await bcrypt.compare(password, match.password);

    // token generate
    const token = await match.generateAuthToken();// here match is instance of Register model
        console.log("the part of "+ token)
    if(isMatch){
        resp.status(201).render("home");

    }
    else {
        resp.send("invalid email");
    }
        
    } catch (error) {
        resp.status(500).json("invalid login details");
    }
    // resp.send("hi i am shlok")
    
    // resp.send("successful");
    // console.log(match)
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

})
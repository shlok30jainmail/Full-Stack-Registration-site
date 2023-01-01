const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");


const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        reuired:true
    },
    lastname:{
        type:String,
        reuired:true
    },
    email:{
        type:String,
        reuired:true,
        unique:true
    },
    // gender:{
    //     type:String,
    //     reuired:true
    // },
    phone:{
        type:Number,
        reuired:true,
        unique:true

    },
    password:{
        type:String,
        reuired:true
    },
    confirmpassword:{
        type:String,
        reuired:true
    },
    tokens:[{
        token:{
            type:String,
            reuired:true
        },

    }]
   

    
})

// generate token 
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        // console.log(token);
        await this.save();
        return token;
        
    } catch (error) {
        resp.send("successfully working");

    }
}




// change password into hash password by using bcrypt 
employeeSchema.pre("save",async function(next){
    
    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(password , 10);// here 10 is round how many round is used by hacker to hack it
        console.log(this.password);
        this.password = await bcrypt.hash(this.password , 10);
        this.confirmpassword = await bcrypt.hash(this.password , 10);
        console.log(this.password);

        // for security purpose we will do it ---
        // this.confirmpassword = undefined; // taki save hone ke time password hash ho to confirm password undefine ho jaye

    }
    next();

    
});

const Register = new mongoose.model("Register",employeeSchema);
module.exports=Register;
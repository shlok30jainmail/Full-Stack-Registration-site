const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CON).then(()=>{
    console.log("database connection successfully")
}).catch((e)=>{
    console.log("database connection failed",e)

})
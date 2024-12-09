const express = require("express");
const router = express.Router();

router.get("/",function (rej,res){
    console.log("hey")
})


module.exports=router;
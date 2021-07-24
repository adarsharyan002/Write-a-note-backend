const express= require('express');
const router =express.Router();
const {signUp}=require("../controllers/auth");
const {signIn}=require("../controllers/auth");
router.post("/signup",signUp);
router.post("/signin",signIn);



module.exports =router;
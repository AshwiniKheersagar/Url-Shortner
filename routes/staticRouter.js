const express=require('express');
const Url=require('../models/url');
const router=express.Router();
const {restrictTo} =require('../middlewares/auth');
const User = require("../models/user");

router.get("/admin/urls",restrictTo(["ADMIN"]),async(req,res)=>{
    if(!req.user) return res.redirect('/login')
    const allUrls = await Url.find({});
    const allUsers=await User.find({});
    res.render('home',{urls:allUrls,users:allUsers});
});

router.get('/',restrictTo(["NORMAL","ADMIN"]),async(req,res)=>{
    if(!req.user) return res.redirect('/login')
    const allUrls = await Url.find({createdBy: req.user._id});
    res.render('home',{urls:allUrls});
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/login',(req,res)=>{
    res.render('login');
});

module.exports=router;

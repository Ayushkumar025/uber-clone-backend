const userModel= require('../models/user.model');
const userService=require('../services/user.service')
const {validationResult}=require('express-validator')
const blacklistTokenModel = require('../models/blacklistToken.model');


module.exports.registerUser=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    console.log(req.body)

    const {fullname, email, password}=req.body;

    const isUserAlready=await userModel.findOne({email});

    if(isUserAlready){
        return res.status(400).json({message:'User already exist'})
    }

    const hashedPassword=await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    });

    const token = user.generateAuthtoken();

    res.status(201).json({token,user});
}

module.exports.loginUser=async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}=req.body;

    const user= await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({errors:[{msg:'Invalid Credentials'}]})
    }

    const isMatch=await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({errors:[{msg:'Invalid Credentials'}]})
    }

    const token = user.generateAuthtoken();

    res.cookie('token',token)

    res.status(200).json({token,user});
}

module.exports.getUserProfile=async(req,res,next)=>{
    res.status(200).json({user:req.user});
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("token");
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        // Check if token already exists in the blacklist
        const existingToken = await blacklistTokenModel.findOne({ token });

        if (!existingToken) {
            await blacklistTokenModel.create({ token });
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
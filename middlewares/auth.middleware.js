const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const blacklistTokenModel=require('../models/blacklistToken.model');
const captainModel=require('../models/captain.model');



module.exports.authUser=async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log(token,"this is token");
    
    if(!token){
        return res.status(401).json({errors:[{msg:'unauthorized token'}]})
    }

    const isBlackListed = await userModel.findOne({ token:token });

    if(isBlackListed){
        return res.status(401).json({message: 'unauthorized'})
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user= await userModel.findById(decoded._id);
        
        


        req.user=user;
        console.log(user,"ayush");
        
        next();
    }
    catch(err){
        return res.status(401).json({errors:[{msg:'Unauthorized'}]})
    }
}

module.exports.authCaptain=async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log(token,"this is token");
    
    if(!token){
        return res.status(401).json({errors:[{msg:'unauthorized token'}]})
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token:token });

    if(isBlackListed){
        return res.status(401).json({message: 'unauthorized'})
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const captain= await captainModel.findById(decoded._id);
        req.captain=captain;
        return next();
    }catch(err){
        return res.status(401).json({errors:[{msg:'Unauthorized'}]})
    }
}
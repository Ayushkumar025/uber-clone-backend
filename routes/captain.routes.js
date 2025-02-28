const express=require('express')
const captainController=require('../controllers/captain.controller')
const router=express.Router()
const {body}=require('express-validator')
const authmiddleware=require('../middlewares/auth.middleware')



router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({min:1}).withMessage('capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('invalid vehicly type')
],
    captainController.registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],
    captainController.loginCaptain
)

router.get('/profile',authmiddleware.authCaptain,captainController.getCaptainProfile)

router.get('/logout',authmiddleware.authCaptain,captainController.logoutCaptain)

module.exports=router
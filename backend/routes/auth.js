const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harshisgoingtosuccesfulhegetwhathewantswhathedesireswhathedeserves$';

//Route 1 : Craete a User using :POST "/api/auth/createuser" . Doesn't require Auth.
router.post('/createuser' , [
    body('name' , 'Enter a valid name').isLength({min:3}),
    body('email' , 'Enter a valid email').isEmail(),
    body('password' , 'Enter a valid password : atleast 5 characters').isLength({min:5}),
] , async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
   
    // chech whether user with this is already exists or not
    try {
        let user = await User .findOne({email : req.body.email});
        if(user){
            return res.status(400).json({error : "sorry a user with this email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);
        
        //create a new user
        user = await User.create({
            name : req.body.name ,
            email : req.body.email ,
            password : secPass
        })
        
        const data = {
            user : {
                id : user.id
            }
        }

        const authToken = jwt.sign(data,JWT_SECRET);

        res.json({authToken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured");
    }
})

//Route 2 : Authenticate a User using :POST "/api/auth/login" . No login required.
router.post('/login' , [
    body('email' , 'Enter a valid email').isEmail(),
    body('password' , 'password cannot be blank').exists(),
] ,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email , password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"please try to login with correct credentials"});
        }

        const data = {
            user : {
                id : user.id
            }
        }

        const authToken = jwt.sign(data,JWT_SECRET);
        res.json({authToken});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occured");
    }
})

//Route 3 : get logged in user details using : POST "/api/auth/getuser" . Login Required.
router.post('/getuser' ,fetchuser, async (req , res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
})

module.exports = router
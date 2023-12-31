
const User = require('../models/user')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/',async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch(err){
        res.status(500).json({message: err.message})
    }

})
router.post('/', async(req,res)=> {
    if(await User.findOne({"username":req.body.username})){
        res.status(403).json({message:"User with this username already exists"})
    }else{
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                username: req.body.username,
                password: hashedPassword
            })
            const newUser = await user.save()
            res.status(201).send(newUser)
        }catch(err){
            res.status(500).send({message: err.message})
        }
    }
})

router.post('/login',async (req,res)=>{
   const user = await User.findOne({"username": req.body.username})
   if(user==null){
    res.status(404).json({message:"Cannot find user"})
   }else{
    try{
            if (await bcrypt.compare(req.body.password, user.password)){
                const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET)
                res.json({message:"Login successfull", accessToken: accessToken})
            }else{
                res.status(401).json({message: "Invalid credentials"})
            }
    }catch(err){
            res.status(500).send({message: err.message})
    }
   }
})
module.exports = router
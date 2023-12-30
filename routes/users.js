
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
// add checking for unique name functionality
router.post('/', async(req,res)=> {
    // const exists = await User.findOne({"username": req.body.username})
    // console.log("exists:",exists)
    if(await User.findOne({"username":req.body.username})){
        // console.log("Already exists")
        res.status(403).json({message:"User with this username already exists"})
    }else{
        console.log("Does not exist, may proceed")
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            // console.log(hashedPassword)
            const user = new User({
                username: req.body.username,
                password: hashedPassword
            })
            const newUser = await user.save()
            // console.log(newUser, req.body.username)
            res.status(201).send(newUser)
        }catch(err){
            res.status(500).send({message: err.message})
        }
    }
})

router.post('/login',async (req,res)=>{
//    const user = User.find(user => user.username === req.body.username)
   const user = await User.findOne({"username": req.body.username})
   console.log(user.username)
   if(user==false){
    res.status(400).json({message:"Cannot find user"})
   }
   try{
        if (await bcrypt.compare(req.body.password, user.password)){
            // res.send('Success')
            // const username = req.body.username
            const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET)
            res.json({ accessToken: accessToken})
        }else{
            res.send('Not allowed')
        }
   }catch(err){
        res.status(500).send({message: err.message})
   }
})
module.exports = router
require('dotenv').config()

const express = require('express')
const app = express()
const { ROLE, users, projects } = require('./data')
const { authUser, authRole } = require('./basicAuth')
const projectRouter = require('./routes/projects')
const listsRouter = require('./routes/lists')
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(setUser)
app.use('/projects', projectRouter)
app.use('/lists', listsRouter)


const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error) => console.error(error))

db.once('open', () => console.log('Connected to Database'))

app.get('/', (req, res) => {
  res.send('Home Page')
})

app.get('/posts',authenticateToken, (req, res) => {
  console.log(projects[req.user-1].id)
  console.log(req.user)
  res.json(projects.filter(proj => proj.userId == req.user))
  res.send()
})

app.post('/login', (req, res)=> {
  //Authenticate user TODO (also a video that exists)
  const username = req.body.username
  
  const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken})
})

app.get('/home', authUser, (req, res) => {
  res.send('Home Page')
})

app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send('Admin Page')
})

function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next()
}


function authenticateToken(req, res, next){
  console.log("start of authenticateToken",req.body.username)
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  //MAYBE CHANGE "USERNAME" cause it's supossed to be the serialized object, which could mean that i need the object from my data.js file
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username)=> {
    if(err) return res.sendStatus(403)
    req.user = username
    console.log(req.user, "username:", username)
    next()
  })
}

app.listen(3000)

const jwt = require('jsonwebtoken')

function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403)
    return res.send('You need to sign in')
  }

  next()
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401)
      return res.send('Not allowed')
    }

    next()
  }
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
  })}

module.exports = {
  authUser,
  authRole,
  authenticateToken
}

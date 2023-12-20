const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser } = require('../basicAuth')

router.get('/' ,(req,res)=>{
  res.json('/lists')
  console.log("GET GET LISTS")
})

//POST = UPDATE
router.post('/' ,(req,res)=>{
  res.json ('router.post/lists')
})

router.put('/' ,(req,res)=>{
  res.json('router.put/lists')
})

 router.delete('/:listId' ,(req,res)=>{
  res.json('router.delete/lists')
})

module.exports = router

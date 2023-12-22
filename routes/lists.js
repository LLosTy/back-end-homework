const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser } = require('../basicAuth')

// Getting a list
router.get('/' ,(req,res)=>{
  res.json('/lists')
  console.log("GET GET LISTS")
})

// POST = CREATE a list
router.post('/' ,(req,res)=>{
  res.json ('router.post/lists')
})

// Updating a list 
router.patch('/' ,(req,res)=>{
  res.json('router.put/lists')
})

// Deleting a list
 router.delete('/:listId' ,(req,res)=>{
  res.json('router.delete/lists')
})

module.exports = router

const List = require('../models/list')
const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../basicAuth')


// Getting all lists
router.get('/' ,authenticateToken, async (req,res)=>{
  try {

    const lists = await List.find({"shoppingListMembers.shoppingListMemberName":req.user })
    res.json(lists)
  } catch (err){
    res.status(500).json({ message: err.message})
  }
})

//Getting a list
router.get('/:listId' ,authenticateToken,getList(false),async (req,res)=>{
  res.json(res.list)
})

// POST = CREATE a list
router.post('/',authenticateToken, async (req, res) => {
  try {
    // Create a new List object
    const list = new List({
      shoppingListName: req.body.shoppingListName,
      shoppingListIsArchived: req.body.shoppingListIsArchived
    });
      const newMember = {
        shoppingListMemberName: req.user,
        shoppingListMemberIsOwner: true
      }
      list.shoppingListMembers.push(newMember)

    // Save the list to the database
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Updating a list - only listName and listIsArchived, the rest should be handled by it's respective endpoints 
router.patch('/:listId',authenticateToken, getList(true) ,async (req,res)=>{
  if(req.body.shoppingListName != null){
    res.list.shoppingListName = req.body.shoppingListName
  }

  if(req.body.shoppingListIsArchived != null){
    res.list.shoppingListIsArchived = req.body.shoppingListIsArchived
  
  }

  try{
    const updatedList = await res.list.save()
    res.json(updatedList)
  } catch(err){
    res.status(400).json({ message: err.mesage })
  }
})

// Deleting a list
 router.delete('/:listId',authenticateToken,getList(true) ,async (req,res)=>{

  try{
    await res.list.deleteOne()
    res.status(200).json({ message: 'Deleted list'})
  }catch(err){
    res.status(500).json({ message: err.message })
  }
  
})


function getList(isOwner){
return async(req, res, next) => {
 let list
 try{
  list = await List.findById(req.params.listId)
  if (list == null){
    return res.status(404).json({message: "Cannot find list"})
  }
 }catch (err){
    return res.status(500).json({message: err.message})
 } 
  if(isOwner == true){
  
      if (list.shoppingListMembers.find((member) => member.shoppingListMemberName == req.user && member.shoppingListMemberIsOwner == true)){
        res.list = list
        next()
      }else{
        return res.status(401).json({message: "Unauthorized"})
      }
  }   
  if(isOwner == false){
   if (list.shoppingListMembers.find((member) => member.shoppingListMemberName == req.user)){
    res.list = list
    next()
   }else{
      return res.status(401).json({message: "Unauthorized"})
   }
  }
 }
} 
module.exports = router

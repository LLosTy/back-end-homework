const List = require('../models/list')
const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser } = require('../basicAuth')

// Getting all lists
router.get('/' ,async (req,res)=>{
  try {

    const lists = await List.find()
    res.json(lists)
  } catch (err){
    res.status(500).json({ message: err.message})
  }
})

//Getting a list
router.get('/:listId' ,getList,async (req,res)=>{
  res.json(res.list)
})

// POST = CREATE a list
router.post('/', async (req, res) => {
  try {
    // Create a new List object
    const list = new List({
      shoppingListName: req.body.shoppingListName,
      shoppingListIsArchived: req.body.shoppingListIsArchived
    });

    let ownerFound = false;

    // Iterate through shoppingListItems in the request body
    if (req.body.shoppingListItems && Array.isArray(req.body.shoppingListItems)) {
      req.body.shoppingListItems.forEach(item => {
        list.shoppingListItems.push({
          shoppingListItemName: item.shoppingListItemName,
          shoppingListItemArchivedState: item.shoppingListItemArchivedState
        });
      });
    }

    // Iterate through shoppingListMembers in the request body
    if (req.body.shoppingListMembers && Array.isArray(req.body.shoppingListMembers)) {
      req.body.shoppingListMembers.forEach(member => {
        const newMember = {
          shoppingListMemberName: member.shoppingListMemberName,
          shoppingListMemberIsOwner: member.shoppingListMemberIsOwner
        };

        if (newMember.shoppingListMemberIsOwner) {
          // Check if an owner already exists
          if (ownerFound) {
            throw new Error('Only one member can be the owner.');
          }
          ownerFound = true;
        }

        list.shoppingListMembers.push(newMember);
      });
    }

    // Save the list to the database
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Updating a list - only listName and listIsArchived, the rest should be handled by it's respective endpoints 
router.patch('/:listId',getList ,async (req,res)=>{
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
 router.delete('/:listId',getList ,async (req,res)=>{

  try{
    await res.list.deleteOne()
    res.status(200).json({ message: 'Deleted list'})
  }catch(err){
    res.status(500).json({ message: err.message })
  }
  
})

async function getList(req, res, next){
 let list
 try{
  list = await List.findById(req.params.listId)
  console.log("list:",list, "req.params.id", req.params.listId)
  if (list == null){
    return res.status(400).json({message: "Cannot find list"})
  }
 }catch (err){
    return res.status(500).json({message: err.message})
 } 
 res.list = list
 next()
}

module.exports = router

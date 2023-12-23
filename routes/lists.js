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
router.get('/:id' ,getList,async (req,res)=>{
  res.json(res.list.shoppingListName)
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


// Updating a list 
router.patch('/:listId' ,(req,res)=>{
  res.json('router.put/lists')
})

// Deleting a list
 router.delete('/:listId' ,(req,res)=>{
  res.json('router.delete/lists')
  
})

async function getList(req, res, next){
 let list
 try{
  list = await List.findById(req.params.id)
  console.log("list:",list, "req.params.id", req.params.id)
  if (list == null){
    return res.status(400).json({message: "Cannot find list"})
  }
 }catch{
    return res.status(500).json({message: err.message})
 } 
 res.list = list
 next()
}

module.exports = router

const List = require('../models/list')
const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser } = require('../basicAuth')

// Getting a list
router.get('/' ,async (req,res)=>{
  try {

    const lists = await List.find()
    res.json(lists)
  } catch (err){
    res.status(500).json({ message: err.message})
  }
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
router.patch('/' ,(req,res)=>{
  res.json('router.put/lists')
})

// Deleting a list
 router.delete('/:listId' ,(req,res)=>{
  res.json('router.delete/lists')
})

module.exports = router

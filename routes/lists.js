const List = require('../models/list')
const express = require('express')
const router = express.Router()
const { projects } = require('../data')
const { authUser,authenticateToken } = require('../basicAuth')

// db.lists.find({"shoppingListMembers.shoppingListMemberName":"User1"})

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
  // console.log(req.user)
  try {
    // Create a new List object
    const list = new List({
      shoppingListName: req.body.shoppingListName,
      shoppingListIsArchived: req.body.shoppingListIsArchived
    });

    // let ownerFound = false;

    // // Iterate through shoppingListItems in the request body
    // if (req.body.shoppingListItems && Array.isArray(req.body.shoppingListItems)) {
    //   req.body.shoppingListItems.forEach(item => {
    //     list.shoppingListItems.push({
    //       shoppingListItemName: item.shoppingListItemName,
    //       shoppingListItemArchivedState: item.shoppingListItemArchivedState
    //     });
    //   });
    // }

    // // Iterate through shoppingListMembers in the request body
    // if (req.body.shoppingListMembers && Array.isArray(req.body.shoppingListMembers)) {
    //   req.body.shoppingListMembers.forEach(member => {
    //     const newMember = {
    //       shoppingListMemberName: member.shoppingListMemberName,
    //       shoppingListMemberIsOwner: member.shoppingListMemberIsOwner
    //     };

    //     if (newMember.shoppingListMemberIsOwner) {
    //       // Check if an owner already exists
    //       if (ownerFound) {
    //         throw new Error('Only one member can be the owner.');
    //       }
    //       ownerFound = true;
    //     }

    //     list.shoppingListMembers.push(newMember);
    //   });
    // }
    // else{
      const newMember = {
        shoppingListMemberName: req.user,
        shoppingListMemberIsOwner: true
      }
      list.shoppingListMembers.push(newMember)
    // }

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
  // const listChanges =  List.updateMany({
  //   shoppingListName: req.body.shoppingListName,
  //   shoppingListIsArchived: req.body.shoppingListIsArchived
  // });

  try{
    const updatedList = await res.list.save()
    // await listChanges.save()
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

// make checkUser and getList into the same function

function getList(isOwner){
return async(req, res, next) => {
 let list
 try{
  list = await List.findById(req.params.listId)
  // console.log("list:",list, "req.params.id", req.params.listId)
  if (list == null){
    return res.status(404).json({message: "Cannot find list"})
  }
 }catch (err){
    return res.status(500).json({message: err.message})
 } 
  if(isOwner == true){
  
      if (list.shoppingListMembers.find((member) => member.shoppingListMemberName == req.user && member.shoppingListMemberIsOwner == true)){
        // console.log("found Owner")
        res.list = list
        next()
      }else{
        return res.status(401).json({message: "Unauthorized"})
      }
  //   list.shoppingListMembers.forEach(member => {
  //     if((member.shoppingListMemberName == req.user) && (member.shoppingListMemberIsOwner == true)){
  //       console.log("found owner!")
  //       res.list = list
  //       next()
  //     }else{console.log("go next, member.shoppingListMemberName",member.shoppingListMemberName, member.shoppingListMemberIsOwner, req.user)}})  
  // }else{
  //   list.shoppingListMembers.forEach(member => {
  //     if(member.shoppingListMemberName == req.user){
  //       res.list = list
  //       next()
  //     }})
      // list.shoppingListMembers.filter((member) => member.shoppingListMemberName == req.user && member.shoppingListMemberIsOwner == true)
  // }
  // doesnt have to be here sice authToken handles authorization for me
  // return res.status(401).json({message: "Unauthorized"})
  }   
  if(isOwner == false){
  //  console.log(list.shoppingListMembers.find((member) => member.shoppingListMemberName == req.user))
   if (list.shoppingListMembers.find((member) => member.shoppingListMemberName == req.user)){
      // console.log("found Owner")
    // console.log("found member")
    res.list = list
    next()
   }else{
      return res.status(401).json({message: "Unauthorized"})
   }
  }
 }
} 

// function checkUser(isOwner)
// return(req, res, next) => {
//   if(isOwner == true){
//     // in request, compare if req.user = isOwner in shoppingListMembers 
//     list = 
//     //iterate through shopping list with id from req.params.listId
//   }else{
//     //in requrest, compare if req.user is in shoppingListMembers 
//   }
// }

module.exports = router

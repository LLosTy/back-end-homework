const mongoose = require('mongoose')


const shoppingListSchema = new mongoose.Schema({
    shoppingListName:{
        type: String,
        required: true
    },
    shoppingListItems:[{
        shoppingListItemName:{
            type: String,
            required: true
        },
        shoppingListItemArchivedState:{
            type: Boolean,
            required: true,
            default: false
        }
    }],
    shoppingListMembers:[{
        shoppingListMemberName:{
            type: String,
            required: true
        },
        shoppingListMemberIsOwner:{
            type: Boolean,
            required: true
        }
    }],
    shoppingListIsArchived:{
        type: Boolean,
        required: true,
        default: false
    }
})


module.exports = mongoose.model('List',shoppingListSchema)
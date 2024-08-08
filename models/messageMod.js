const mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
    content : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 100
    },

    archived : {
        type : Boolean,
    },

    attachments : {
        type : Array,
        required : false
    },

    status: {
        type: String, 
        enum: ["sent", "delivered", "read"],
    },

    // sender_id :{

    // },



    // receiver_id :{

    // }


    createdAt: {
        type: Date,
        default: Date.now
    }},

    {
        timestamp : true
     }

)

messageSchema.pre('save',function(next){
    this.createdAt = Date.now();
    next();
});

let messageModel = mongoose.model("Message",messageSchema);
module.exports = messageModel;













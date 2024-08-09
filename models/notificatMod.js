import mongoose, { Schema, model } from 'mongoose';

let notificationSchema = new Schema({
state : {
    type : String,
    enum : ["pending","read"],
    default : "pending"
},

action_url : {
    type :String,
},

note_content : {
    type : String,
    required:true
},

user_id : {
    type : mongoose.Schema.ObjectId,
    required : true
},

sort : {
    type : String,
    enum : ["website_update","new_comment","new_message","new_review"]
},

createdAt: {
    type : Date,
    default: Date.now
}},

    {
        timestamp : true
     });


notificationSchema.pre('save', function(next) {
    this.createdAt = Date.now();
    next();
});


let notificationModel = model("Notification", notificationSchema);

export default notificationModel
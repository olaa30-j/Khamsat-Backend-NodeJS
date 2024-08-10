import notificationModel from '../models/notificatMod.js';

//================================================= Create New Notification ==================================================//
export const createNotification = async(req,res) =>{
  try{

   let newNotification = req.body;
   let notification = await notificationModel.create(newNotification);
   res.status(201).json({message:"successful notification",data:notification});

  } catch(err) {
    res.status(400).json({message :"failed to create notification,check again"})
  }};


//====================================== Get All Notifications(limit 5, skip 0 default) =======================================//
export const getAllNotifications = async (req,res) =>{
    const skip = parseInt(req.query.skip) || 0 
    const limit = parseInt(req.query.limit) || 5 

    try{
      const fetchedNotifications = await notificationModel.find().skip(skip).limit(limit);
      res.status(201).json({message:"fethced notifications success",data:fetchedNotifications});

    } catch(err){
        res.status(500).json(err)
    }};

    
//================================================ Get Notification By Id =======================================================//

export const getNotificationById = async (req,res) =>{
    const {id} = req.params;
    try{
      const fetchedNotification = await notificationModel.findById(id);
    
      // in case the id is incorrect or doesnt exist at all
    if (!fetchedNotification) {
          return res.status(404).json({ message: "notification not found" });
        }
    
    res.status(201).json({message:"fetched notification successfully",data:fetchedNotification});
    
    } catch(err) {
      res.status(500).json({message:"cannot fetch notification",err})
    }};

    //================================================ Edit Notification By Id =====================================================//
    
export const editNotificationById = async(req,res) =>{
    const {id} = req.params;
    const newData = req.body;
  
    try{
      const updatedNotification = await notificationModel.findByIdAndUpdate(id,newData,{
        new : true , 
        runValidators : true 
      });
  
      // in case the id is incorrect or doesnt exist at all
  if (!updatedNotification) {
        return res.status(404).json({ message: "notification doesnt exist"});
      }
      res.status(201).json({message:"notification updated successfully",data:updatedNotification});
      
    } catch (err){
      res.status(500).json({message:"cannot update notification"});
    }};

    
    //================================================= Delete Notification By Id ======================================================//
    export const deleteNotificationById = async(req,res) =>{
        const {id} = req.params;
        
        try{
         const deletednotification = await notificationModel.findByIdAndDelete(id);
         res.status(201).json({message:"deleted notification successfully",data:deletednotification});
          }
      
          catch(err){
            res.status(404).json({message:"failed to delete notification"});
        }};
      
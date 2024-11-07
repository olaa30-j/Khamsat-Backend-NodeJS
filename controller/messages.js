import { io } from '../index.js';
import messageModel from '../models/messages.js';
import users from '../models/users.js';

//=======================================  Creating New Message ==================================================//
export const createMessage = async (req, res) => {
  try {
    let newMessage = req.body;
    let message = await messageModel.create(newMessage);
    let senderUser = await users.findById(newMessage.sender_id);
    io.to(String(newMessage.receiver_id)).emit("orderMeassage", {
      notification: {
        id: Math.floor(Math.random() * 99999999),
        message: `هناك رسالة جديدة من ${senderUser.first_name.ar}`,
        serviceLink: `/orders/${newMessage.order_id}`,
        status: 'orderMessage'
      }
    })
    res.status(201).json({ message: "success creating message", data: message });

  } catch (err) {
    res.status(400).json({ message: "failed to create message" });
  }
};

//============  Getting Messages By order : using skip = 0 & limit = 10 as default or from user query ======================//

export const getMessagesByOrder = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const { orderId } = req.params

  try {
    const fetchedMessages = await messageModel.find({ order_id: orderId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'sender_id',
        select: ['first_name', 'last_name', 'profilePicture'],
      })
      .exec()
    res.status(201).json({ message: "fetched messages succesfully", data: fetchedMessages });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "err cannot get messages", err });
  }
};
//============  Getting Messages : using skip = 0 & limit = 5 as default or from user query ======================//

export const getMessage = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 5;


  try {
    const fetchedMessages = await messageModel.find().skip(skip).limit(limit);
    res.status(201).json({ message: "fetched messages succesfully", data: fetchedMessages });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "err cannot get messages", err });
  }
};

//=============================================== Get Message By Id ================================================//

export const getMessageById = async (req, res) => {
  const { id } = req.params
  try {
    const fetchedMessage = await messageModel.findById(id);

    // in case the id is incorrect or doesnt exist at all
    if (!fetchedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(201).json({ message: "fetched message successfully", data: fetchedMessage });

  } catch (err) {
    res.status(500).json({ message: "cannot fetch message", err })
  }
};

//================================================= Edit Message By Id ===============================================//
//handle when user updates based on NONEXISTENT id 
// handle when user updates against validation standards based on schema 

export const editMessageById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedMessage = await messageModel.findByIdAndUpdate(id, updateData, {
      new: true,  //to return updated message not old message
      runValidators: true // to check for model validation beforehand
    });

    // in case the id is incorrect or doesnt exist at all
    if (!updatedMessage) {
      return res.status(404).json({ message: "the message you wanna edit,doesnt exist" });
    }
    res.status(201).json({ message: "message updated successfully", data: updatedMessage });

  } catch (err) {
    res.status(500).json({ message: "cannot update message", err });
  }
};


//================================================= Delete Message By Id ===============================================//
export const deleteMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await messageModel.findByIdAndDelete(id);
    res.status(201).json({ message: "deleted message successfully", data: deletedMessage });
  }

  catch (err) {
    res.status(404).json({ message: "cannot delete message" });
  }
};
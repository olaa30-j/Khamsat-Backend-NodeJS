import messages from '../models/messageMod.js';
//======================================= Creating new message ==================================================//
export async function createMessage(req, res) {
    try {
      let newMessage = req.body;
      let message = await messages.create(newMessage);

      res.status(201).json({ message: "success creating message", data: message });

    } catch (err) {
      res.status(400).json({ message: "failed to create message" });
    }

  }
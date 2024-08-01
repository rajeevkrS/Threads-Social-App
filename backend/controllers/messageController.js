import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

//Send Message API
const sendMessage = async (req, res) => {
  try {
    // Logic to send a message to receiver
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    // check if conversation exists or not between the sender & recipient
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    // if not, create new converstation
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });

      // save into DB
      await conversation.save();
    }

    // After creating cconversation, now creating a message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    // saving into DB with the update of lastMessage field
    await Promise.all([
      newMessage.save(),

      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Messages API
const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  try {
    // Find the conversations
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    // if conversation not found
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found!" });
    }

    // Find all the messages that logged in user and other user has in conversationId
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCoversation = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find all conversations of particular user.
    // as participants has the reference of User, using populate method fetching the username and profile pic of the users
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getMessages, getCoversation };

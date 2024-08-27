import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

//Send Message API
const sendMessage = async (req, res) => {
  try {
    // Logic to send a message to receiver
    const { recipientId, message } = req.body;
    let { img } = req.body;
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

    // clodinary setup for upload images
    if (img) {
      const uploadRes = await cloudinary.uploader.upload(img);
      img = uploadRes.secure_url;
    }

    // After creating cconversation, now creating a message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
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

    // Retrieve the Recipient's Socket ID for determining whether the recipient is currently online and connected to the WebSocket server.
    const recipientSocketId = getRecipientSocketId(recipientId);

    // If the recipient is online,
    if (recipientSocketId) {
      // sending the "newMessage" event
      // the server sends a newMessage event to the specific socket ID of the recipient using "io.to().emit()"
      // The newMessage is sent directly to the recipient's socket, ensuring they receive the message in real-time.
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

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

    // remove the current user from participants array so that we can display other user's username & profilePic
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getMessages, getCoversation };

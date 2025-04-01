import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "cloudinary";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Filtered users are those users whose ids are not equal to loggedInUserId
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error in getUsersForSidebar : ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params; // Id renamed to userToChat
    const myId = req.user._id;

    // Find all the messages from these two users sender and receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChat },
        { senderId: userToChat, receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages : ", error.messages);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // can be undefined or actual value from cloudinary
    });

    await newMessage.save();

    // TODO : Real time functionality goes here -> socket.io
    //

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller : ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

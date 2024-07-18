import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create Post API
const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    // if not provided
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and Text fileds are required!" });
    }

    // if user dont exists
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // restrict user to create the post for someone else
    if (user._id.toString() != req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post!" });
    }

    // limit the length of the post
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // upload img to cloudinary
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // After the above checks, Now creating the Post
    const newPost = new Post({ postedBy, text, img });

    //saving in the db
    await newPost.save();

    // sending a response with the new post data
    res.status(201).json({ message: "Posted created successfully!", newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in creating a post: ", error.message);
  }
};

// Get Post API
const getPost = async (req, res) => {
  try {
    //Find the post using the post id
    const post = await Post.findById(req.params.id);

    // if not exists
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    // if post found then sending a response with the post data
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getting a post: ", error.message);
  }
};

// Delete Post API
const deletePost = async (req, res) => {
  try {
    //Find the post using the post id
    const post = await Post.findById(req.params.id);

    // if not exists
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    // delete post only by the owner of that post
    if (post.postedBy.toString() != req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "Unauthorized to delete the post!" });
    }

    // deleting the img from cloudinary
    if (post.img) {
      // getting the img id
      const imgId = post.img.split("/").pop().split(".")[0];

      // removing
      await cloudinary.uploader.destroy(imgId);
    }

    // after above checks, removing from the DB
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in deleting a post: ", error.message);
  }
};

// Like/Unlike Post API
const likeUnlikePost = async (req, res) => {
  try {
    // get the post's id renamed as postId
    const { id: postId } = req.params;

    // get the userId from protected routes
    const userId = req.user._id;

    // find postId from db
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    // check if likes array has userId or not
    const userLikedPost = post.likes.includes(userId);

    // if user liked the post
    if (userLikedPost) {
      // unlike post- if user unlike any post then pull out the userId
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully!" });
    } else {
      // like post- if user likes any post the pushing that userId
      post.likes.push(userId);

      // saving in the db
      await post.save();
      res.status(200).json({ message: "Post liked successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in like / unlike the post: ", error.message);
  }
};

// Reply to the Post API
const replyPost = async (req, res) => {
  try {
    // get data from client site
    const { text } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    // if no text filled
    if (!text) {
      return res.status(400).json({ error: "Text field is required!" });
    }

    // Find post id from DB
    const post = await Post.findById(postId);
    if (!post) {
      return res(404).json({ error: "Post not found!" });
    }

    // creating a reply and pushing in replies array[] of post schema
    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);

    // saving the replies in db
    await post.save();

    res.status(200).json({ message: "Reply added successfully!", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in reply to the post: ", error.message);
  }
};

// Get all post in the feed API
const getFeedPosts = async (req, res) => {
  try {
    // decoded user id
    const userId = req.user._id;

    // find user id from db
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // get the list of users that current users follows
    const following = user.following;

    // Find the post were postedBy field in the user's following array and sort the posts in decending order (Latest post at top)
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getting the feed post: ", error.message);
  }
};

// Get Searched User Posts API
const getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Find posts from db using user ID
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyPost,
  getFeedPosts,
  getUserPosts,
};

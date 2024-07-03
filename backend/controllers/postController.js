import User from "../models/userModel.js";
import Post from "../models/postModel.js";

// Create Post API
const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    // if not provided
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "PostedBy and Text fileds are required!" });
    }

    // if user dont exists
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // restrict user to create the post for someone else
    if (user._id.toString() != req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post!" });
    }

    // limit the length of the post
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    // After the above checks, Now creating the Post
    const newPost = new Post({ postedBy, text, img });

    //saving in the db
    await newPost.save();

    // sending a response with the new post data
    res.status(201).json({ message: "Posted created successfully!", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Post not found!" });
    }

    // if post found then sending a response with the post data
    res.status(200).json({ message: "Post found!", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Post not found!" });
    }

    // delete post only by the owner of that post
    if (post.postedBy.toString() != req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete the post!" });
    }

    // after above checks, removing from the DB
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in deleting a post: ", error.message);
  }
};

export { createPost, getPost, deletePost };

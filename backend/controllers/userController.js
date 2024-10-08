import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../util/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Get User Profile
const getUserProfile = async (req, res) => {
  // fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;

  try {
    //Find the user using query without password and updatedAt
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      // if query is userId
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // if query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(400).json({ error: "User not found!" });

    // .json(user) sends the updated user data back to the client in JSON format.
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getting user profile: ", error.message);
  }
};

// Sign-Up User
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Find user with email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });

    //
    if (user) {
      return res.status(400).json({ error: "User already exits!" });
    }

    // Hashing the password before creating the user.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating the new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // saving the user
    await newUser.save();

    // check using response if newUser is in db or not
    if (newUser) {
      // generating the cookie
      generateTokenAndSetCookie(newUser._id, res);

      //sending the response
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        error: "Invalid user data!",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signup user: ", error.message);
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Find user with username
    const user = await User.findOne({ username });

    // check if password is correct -
    // bcrypt will compare the "password" with the "hashed password"
    // The plain text password entered by the user while login (password).
    // The hashed password stored in the database (user?.password).
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // check if user or password is valid
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username & password!" });

    // unfrozen the account
    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    // generating the cookie
    generateTokenAndSetCookie(user._id, res);

    //sending the response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in login user: ", error.message);
  }
};

// Logout User - not async because just clearing the cookies
const logoutUser = (req, res) => {
  try {
    // "cookie" method is used to set a cookie in the client's browser.
    // "jwt" - This is the name of the cookie.
    // "" - Setting the value to an empty string is often a way to clear or delete the cookie.
    // "maxAge: 1" means that the cookie will expire 1 millisecond after being set. Clears the cookie in 1ms.
    res.cookie("jwt", "", { maxAgge: 1 });

    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logout user: ", error.message);
  }
};

// Follow / Unfollow user
const followUnfollowUser = async (req, res) => {
  try {
    // /user/follow:id, the value of id will be available in req.params
    const { id } = req.params;

    // Find user by id to follow / unfollow
    const userToModify = await User.findById(id);

    // getting user id from req object from protectRoute middleware func.
    const currentUser = await User.findById(req.user._id);

    // check if user trying to follow himself
    if (id == req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself!" });
    }

    // if userToModify or currentUser not found by which user can follow / unfollow other user
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found!" });
    }

    // check if id is present using includes() method in the currentUser.following array.
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user- when unfollow any user, removing that user by its id from the current user's following array and removing the current user's id from that unfollowed user's followers array in the same time.
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User unfollowed successfully!" });
    } else {
      // Follow user- ...vice-versa (instead of pull(remove), going to push)
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "User followed successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in follow / unfollow user: ", error.message);
  }
};

// Update user profile
const updateUser = async (req, res) => {
  // req user's id and its info. from the client side
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id; // getting the current user's id

  // checks and update info
  try {
    let user = await User.findById(userId);

    if (!user) return res.status(400).json({ error: "User not found!" });

    // restrict the current user to update of other user's profile
    if (req.params.id != userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile!" });

    //update password- first hashing then updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // if the profile pic is provided from the frontend
    if (profilePic) {
      // remove the old/existing profile pic from cloudinary with public_id
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          // .spilit("/")- splits the URL into parts
          // .pop()- retrieves the last part of the split URL, which includes the public_id and the file extension
          // .split(".")[0]- then removes the file extension, leaving only the public_id
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      // uploading of a new profile pic to Cloudinary and updates the profilePic URL with the secure URL returned by Cloudinary.
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    // updating the user infromation
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    // saving updated user info. in db
    user = await user.save();

    // find all post that logged in user replied and update username and userProfilePic fields
    await Post.updateMany(
      // Filter:
      // This finds all Post documents where any item in the replies array has a userId field that matches the provided userId. Then 👇
      { "replies.userId": userId },

      //Update Operation:
      //The $set operator updates the specified fields. In this case, it updates the username and userProfilePic of the replies array elements that match the filter defined in arrayFilters.
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },

      //Array Filters:
      // This specifies that the update should only apply to array elements where reply.userId matches the provided userId.
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // remove the password before sending as a response
    user.password = null;

    // Returning the updated "user" object confirms to the client that the profile update was successful and shows the current state of the user data.
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in update user: ", error.message);
  }
};

// Get Suggested Users
const getSuggestedUsers = async (req, res) => {
  try {
    // Exclude the current user from suggested users array, also exclude users that current user is already following then filtered the non followed users.

    // getting the current user's id
    const userId = req.user._id;

    // find in db that current user's total following by using "select" method which gives an array that contains the _id's inside the following object
    const usersFollowedByCurrentUser = await User.findById(userId).select(
      "following"
    );

    // Fetch and filter the 10 user's id from DB
    const users = await User.aggregate([
      {
        // filters in the User collection, only returning those where the _id field is not equal to userId
        // This ensures that the current user is excluded from the list of suggested users
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        // randomly selects 10 users from the database who are not the current user.
        $sample: { size: 10 },
      },
    ]);

    // filteredUsers array contains only those users who are not followed by the current user.
    // Filters the list of users obtained from the aggregation pipeline.
    // usersFollowedByCurrentUser.following: array that contains the _ids of the users that the current user is already following.
    // !usersFollowedByCurrentUser.following.includes(user._id): For each user in the users array, this checks if their _id is not included in the following array. If the _id is not in the following array, that user is included in the filteredUsers array.
    const filteredUsers = users.filter(
      (user) => !usersFollowedByCurrentUser.following.includes(user._id)
    );

    // slice method is used to create a new array containing only the first 4 elements from the filteredUsers array.
    const suggestedUsers = filteredUsers.slice(0, 4);

    // sets null to the password field of every suggested users
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Freeze Account
const freezeAccount = async (req, res) => {
  try {
    // get the full user data from the DB
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // freezing the account
    user.isFrozen = true;

    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
};

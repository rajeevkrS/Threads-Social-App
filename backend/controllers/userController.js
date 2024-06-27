import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../util/helpers/generateTokenAndSetCookie.js";

// Sign-Up User
const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    //
    if (user) {
      return res.status(400).json({ message: "User already exits!" });
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
      generateTokenAndSetCookie(newUser._id, res);

      //sending the response
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({
        message: "Invalid user data!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in signup user: ", error.message);
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // check if user or password is valid
    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username & password" });

    generateTokenAndSetCookie(user._id, res);

    //sending the response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.name,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in login user: ", error.message);
  }
};

export { signupUser, loginUser };

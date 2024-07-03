import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // get the JWT token from the cookies
    const token = req.cookies.jwt;

    // If token not found, it responds with a 401 status code and a message.
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // jwt.verify method is used to verify the token using a secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User, select("-password") method excludes the password field
    const user = await User.findById(decoded.userId).select("-password");

    // inside the req object, adding the user info like ID and putting the current user which gets from the db.
    req.user = user;

    // after above checks passing to the next function
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in protect route: ", error.message);
  }
};

export default protectRoute;

/* 
Summary:
This middleware function protects routes by:

-Checking for a JWT token in the request cookies.
-Verifying the token's validity using a secret key.
-Retrieving the user from the database using the ID from the decoded token.
-Attaching the user object to the request object.
-Passing control to the next middleware or route handler if everything is valid.
*/

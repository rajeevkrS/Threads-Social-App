import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // create the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    //this cookie cannot be accessed by the browser(more secure)
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, //15days(day*hr*min*sec*milisec)
    sameSite: "strict", // CSRF
  });
};

export default generateTokenAndSetCookie;

import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // create the token using Refresh tokens
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

// "Access tokens" and "Refresh tokens" are both used in authentication and authorization processes in JSON Web Tokens (JWTs):

// Access tokens
// These temporary credentials grant users access to protected resources, such as files owned by others, or shared resources. They contain information about the user or device, and are usually short-lived. Access tokens can be used for passwordless authentication solutions, or to authenticate API requests.

// Refresh tokens
// These tokens extend the lifespan of access tokens by allowing users to obtain new access tokens when the current ones expire. Refresh tokens are stored as HTTP-only cookies, and can be used to re-authenticate users without exposing sensitive information to JavaScript. This is useful in scenarios where users aren't always available to provide credentials again and again.

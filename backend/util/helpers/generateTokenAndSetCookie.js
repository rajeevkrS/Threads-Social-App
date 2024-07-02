import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // create the token using Refresh tokens
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // "cookie" method is used to set a cookie with specific attributes in the client's browser with the name "jwt" with value token of the user.
  res.cookie("jwt", token, {
    //this cookie cannot be accessed by the browser(more secure)
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, //15days(day*hr*min*sec*milisec)
    sameSite: "strict", // CSRF
  });
};

export default generateTokenAndSetCookie;

// httpOnly: true:

// - This attribute makes the cookie inaccessible to JavaScript running in the browser, helping to prevent cross-site scripting (XSS) attacks.
// - It ensures that the cookie is only sent in HTTP requests and not accessible through client-side scripts.

// maxAge: 15 * 24 * 60 * 60 * 1000:

// - This defines the lifespan of the cookie in milliseconds.
// - 15 * 24 * 60 * 60 * 1000 calculates to 15 days (15 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds).
// - The cookie will expire 15 days after being set.

// sameSite: "strict":

// - This attribute provides protection against Cross-Site Request Forgery (CSRF) attacks.
// - The strict value means that the cookie will only be sent with requests originating from the same site that set the cookie. It will not be sent with cross-site requests, even if the request is initiated from the same user.

// "Access tokens" and "Refresh tokens" are both used in authentication and authorization processes in JSON Web Tokens (JWTs):

// Access tokens
// These temporary credentials grant users access to protected resources, such as files owned by others, or shared resources. They contain information about the user or device, and are usually short-lived. Access tokens can be used for passwordless authentication solutions, or to authenticate API requests.

// Refresh tokens
// These tokens extend the lifespan of access tokens by allowing users to obtain new access tokens when the current ones expire. Refresh tokens are stored as HTTP-only cookies, and can be used to re-authenticate users without exposing sensitive information to JavaScript. This is useful in scenarios where users aren't always available to provide credentials again and again.

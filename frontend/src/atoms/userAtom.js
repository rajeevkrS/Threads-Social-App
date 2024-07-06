import { atom } from "recoil";

// When the user refreshes or visits the website for the first time,
// the default value of the userAtom will be set to whatever user data
// is stored in local storage under the key "user-threads".
const userAtom = atom({
  key: "userAtom",
  // JSON.parse(...) converts this string back into a JavaScript object.
  default: JSON.parse(localStorage.getItem("user-threads")),
});

export default userAtom;

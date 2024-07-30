import { atom } from "recoil";

const postAtom = atom({
  key: "postsAtom",
  default: [], // postAtom as array of objects by default
});

export default postAtom;

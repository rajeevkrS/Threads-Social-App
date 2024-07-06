import { atom } from "recoil";

const authSceenAtom = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authSceenAtom;

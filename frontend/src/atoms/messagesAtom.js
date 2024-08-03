import { atom } from "recoil";

const conversationsAtom = atom({
  key: "conversationsAtom",
  default: [],
});

const selectedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});

export { conversationsAtom, selectedConversationAtom };

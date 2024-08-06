import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText) return;

    try {
      // Fetch Send Message API
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.message, "error");
        return;
      }

      // console.log(data);

      // Update the state with all the messages & the lastest msg too.
      setMessages((messages) => [...messages, data]);

      // Update the conversation state for last message field
      setConversations((prevConvs) => {
        // Create a new array by mapping over the previous conversations
        const updatedConversations = prevConvs.map((conversation) => {
          // Check if the current conversation's _id matches the selectedConversation's _id
          if (conversation._id === selectedConversation._id) {
            // If it matches, return a new conversation object with updated lastMessage
            return {
              ...conversation, // Copy all existing properties of the conversation
              lastMessage: {
                text: messageText, // Set the new text for the last message
                sender: data.sender, // Set the sender of the last message
              },
            };
          }
          // If it doesn't match, return the conversation object as it is
          return conversation;
        });
        // Return the updated array of conversations to be set as the new state
        return updatedConversations;
      });

      // Clearing the state after sending the message
      setMessageText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Type a message.."
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement cursor={"pointer"} onClick={handleSendMessage}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;

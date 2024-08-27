import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText && !imgUrl) return;

    if (isSending) return;

    setIsSending(true);

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
          img: imgUrl,
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
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
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

      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />

        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>

      <Modal
        isOpen={imgUrl}
        onClose={() => {
          onClose();
          setImgUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;

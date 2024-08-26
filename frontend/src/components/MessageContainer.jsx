import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const msgEndRef = useRef(null);

  // handling real-time updates to the conversation and message list when new messages are received through the WebSocket connection.
  useEffect(
    () => {
      // listening the "newMessage" event
      socket.on("newMessage", (message) => {
        // Messages should be sent to the selected conversation only
        if (selectedConversation._id === message.conversationId) {
          // updating the state by creating a new array by spreading the previous messages and appending the new message to the end of the array.
          setMessages((prevMsg) => [...prevMsg, message]);
        }

        // state which holds all the conversations the user is part of.
        setConversations((prevConvo) => {
          const updatedConvo = prevConvo.map((conversation) => {
            //It maps through the current conversations and checks if the conversation ID matches the message.conversationId.
            //This ensures that the conversation preview (which usually shows the last message) is updated in real-time.
            if (conversation._id === message.conversationId) {
              // Updating the Conversation:
              return {
                ...conversation,
                lastMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              };
            }
            // If the conversation ID does not match the message's conversation ID, the code returns the conversation object unchanged.
            return conversation;
          });
          // returning the updated Conversations State
          return updatedConvo;
        });
      });

      //cleanup function that removes the newMessage event listener when the component unmounts or when the socket dependency changes.
      return () => socket.off("newMessage");
    },
    // "socket" instance is responsible for handling WebSocket connections
    // "selectedConversation.userId" ensures that the effect runs whenever the user switches conversations
    //
    [socket, selectedConversation.userId, setConversations.mock]
  );

  //
  useEffect(() => {
    // checks if there are any messages and whether the last message in the array (messages[messages.length - 1]) was sent by another user.
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;

    // socket.emit event to mark the messages as seen, sending the conversationId and userId to the server
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    // listening the "messagesSeen" event
    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        // updating the state
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            // if message is not seen
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }

            return message;
          });
          // returning the updated Messages State
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  // scroll to latest message
  useEffect(() => {
    // Accessing the DOM element via .current to scroll into view
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Fetch Get Messages API
    const getMessages = async () => {
      setLoading(true);
      setMessages([]);

      try {
        if (selectedConversation.mock) return;

        const res = await fetch(`/api/messages/${selectedConversation.userId}`);

        const data = await res.json();
        if (data.error) {
          showToast("Error", data.message, "error");
          return;
        }

        //
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId]);

  return (
    <Flex
      flex={"70"}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      {/* Message Headers */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />

        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider borderColor="red.700" />

      {/* Messages Contanier */}
      <Flex
        flexDirection={"column"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        overflowY={"auto"}
      >
        {loading &&
          // Same
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              // if true (i === 0), then message at left else right
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}

              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>

              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loading &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? msgEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;

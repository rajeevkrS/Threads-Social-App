import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchConvo, setSearchConvo] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);

  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  // Fetch Get Conversations API
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");

        const data = await res.json();
        if (data.error) {
          showToast("Error", data.message, "error");
          return;
        }

        //
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  // Update Conversations when a new message is received
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setConversations((prevConvos) => {
        const updatedConvo = prevConvos.map((convo) => {
          if (convo._id === message.conversationId) {
            const isCurrentConversation =
              selectedConversation._id === message.conversationId;
            return {
              ...convo,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
              unreadCount:
                !isCurrentConversation && message.sender !== currentUser._id
                  ? (convo.unreadCount || 0) + 1
                  : convo.unreadCount,
            };
          }
          return convo;
        });
        return updatedConvo;
      });

      // Update the message container if the message belongs to the selected conversation
      if (selectedConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, selectedConversation, setConversations, currentUser._id]);

  // listening the "messagesSeen" event
  // seen logic
  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      // updatin the state
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }

          return conversation;
        });
        // returnig the updated Conversation state
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  const handleConversationSelect = (conversation) => {
    const user = conversation.participants[0];
    // Mark all messages in the selected conversation as seen if not already
    if (selectedConversation._id !== conversation._id) {
      socket?.emit("messagesSeen", { conversationId: conversation._id });

      setSelectedConversation({
        _id: conversation._id,
        userId: user._id,
        userProfilePic: user.profilePic,
        username: user.username,
        mock: conversation.mock,
      });

      // Reset unread count for the selected conversation
      setConversations((prevConvos) => {
        return prevConvos.map((convo) => {
          if (convo._id === conversation._id) {
            return { ...convo, unreadCount: 0 };
          }
          return convo;
        });
      });
    }
  };

  // Search Conversation Handler
  const handleConvoSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      // Fetch User Profile API
      const res = await fetch(`/api/users/profile/${searchConvo}`);

      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.message, "error");
        return;
      }

      // if current user trying to search themselves to msg
      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself!", "error");
        return;
      }

      // if current user is already in a conversation with the searched user
      // Finding in conversations [] with id's of first participants matches with searchedUser.
      const convoAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (convoAlreadyExists) {
        // updating the state with the details of the existing conversation
        setSelectedConversation({
          _id: convoAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      // Mock Conversation basically creates a new conversation object with default values and the searched user's information
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        //generates a unique ID based on the current timestamp.
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      // upating the state with appending the new mock conversation to the existing conversations array.
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      padding={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxWidth={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>

          {/* Search User */}
          <form onSubmit={handleConvoSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchConvo(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConvoSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loading &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                padding={1}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>

                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loading &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
                handleConversationSelect={handleConversationSelect}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            border={"2px solid gray"}
            borderRadius={"20"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"200px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a coversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;

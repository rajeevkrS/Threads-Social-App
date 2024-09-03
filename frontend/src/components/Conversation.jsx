import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline, handleConversationSelect }) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const colorMode = useColorMode();

  if (!user || !lastMessage) {
    return null;
  }

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={2}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() => handleConversationSelect(conversation)}
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.600"
            : "gray.dark"
          : ""
      }
    >
      {/* Avatar with online status */}
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic || "https://bit.ly/broken-link"}
        >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
        </Avatar>
      </WrapItem>

      {/* Username and Conversations */}
      <Stack direction={"column"} fontSize={"sm"}>
        <Text
          fontWeight={"700"}
          display={"flex"}
          alignItems={"center"}
          color={
            selectedConversation?._id === conversation._id
              ? colorMode === "light"
                ? "black"
                : "white"
              : ""
          }
        >
          {user.username}
        </Text>

        <Box
          fontSize={"xs"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          color={
            selectedConversation?._id === conversation._id
              ? colorMode === "light"
                ? "black"
                : "white"
              : ""
          }
        >
          {currentUser._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? "blue.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}
          {lastMessage.text.length > 10
            ? lastMessage.text.substring(0, 10) + "..."
            : lastMessage.text}

          {/* Show unread messages count */}
          {conversation.unreadCount > 0 && (
            <Box
              bg="red.500"
              color="white"
              borderRadius="full"
              px={2}
              ml={2}
              fontSize="xs"
            >
              {conversation.unreadCount}
            </Box>
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default Conversation;

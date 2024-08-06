import {
  Avatar,
  AvatarBadge,
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
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation }) => {
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
      p={"2"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        })
      }
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.600"
            : "gray.dark"
          : ""
      }
    >
      {/* Avatar */}
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic || "https://bit.ly/broken-link"}
        >
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
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
          {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

        <Text
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
            <BsCheck2All size={16} />
          ) : (
            ""
          )}

          {lastMessage.text.length > 10
            ? lastMessage.text.substring(0, 10) + "..."
            : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;

import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";

const Conversation = () => {
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
    >
      {/* Avatar */}
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src="https://bit.ly/broken-link"
        >
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>

      {/* Username and Conversations */}
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          jane <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          Hello some message ...
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;

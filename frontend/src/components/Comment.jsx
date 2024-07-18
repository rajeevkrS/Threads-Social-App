import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// reply and lastReply props are passed from PostPage.jsx
const Comment = ({ reply, lastReply }) => {
  const navigate = useNavigate();

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar
          src={reply.userProfilePic}
          size={"sm"}
          cursor={"pointer"}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${reply.username}`);
          }}
        />

        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${reply.username}`);
              }}
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {reply.username}
            </Text>
          </Flex>

          <Text>{reply.text}</Text>
        </Flex>
      </Flex>

      {/* If its a last reply in the comment section then not showing Divider */}
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;

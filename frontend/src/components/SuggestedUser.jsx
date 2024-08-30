import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

  return (
    <Flex
      gap={2}
      padding={1}
      justifyContent={"space-between"}
      alignItems={"center"}
      _hover={{
        padding: 1,
        borderRadius: "5px",
        bg: following ? "blue.200" : "gray.300",
        opacity: ".8",
      }}
    >
      {/* Left side */}
      <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box>
          <Text
            fontSize={"sm"}
            fontWeight={"bold"}
            _hover={{ textDecoration: "underline", color: "gray" }}
          >
            {user.username}
          </Text>

          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>

      {/* Right side */}
      <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
          color: following ? "black" : "white",
          opacity: ".8",
        }}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;

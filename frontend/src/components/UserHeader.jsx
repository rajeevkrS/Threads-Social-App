import { VStack, Box, Flex, Text, Link } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useToast,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

// Func. to show the "user" wise information
const UserHeader = ({ user }) => {
  // copy link logic
  const toast = useToast();
  const showToast = useShowToast();

  // get the current logged in user info
  const currentUser = useRecoilValue(userAtom);

  // State to check if currentUser is following the other users
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );

  // updating state
  const [updating, setUpdating] = useState(false);

  // Follow Unfollow Func
  const handleFollowUnfollow = async () => {
    // if no currentUser or not logged in
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    // while updating at that moment if follow unfollow button gets clicked more than once then return out of func
    if (updating) return;

    // updating state to true
    setUpdating(true);

    try {
      //Fetch Follow Unfollow API req
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", error, "error");
        return;
      }

      // check if current user is following another user or not
      if (following) {
        // Unfollow User
        showToast("Success", `Unfollowed ${user.name}`, "success");

        // decrememnt in the followers length by 1
        user.followers.pop();
      } else {
        // Follow User
        showToast("Success", `Followed ${user.name}`, "success");

        // increment in the followers length by 1 with the current user id
        user.followers.push(currentUser?._id);
      }

      // if the res is successful then changing the following state
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      // updating state to true
      setUpdating(false);
    }
  };

  // copy the link of the user profile
  const copyURL = async () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: "Copied!" });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>

          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.400"}
              color={"gray.dark"}
              px={2}
              borderRadius={"full"}
            >
              thread.net
            </Text>
          </Flex>
        </Box>

        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              // Responsive
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}

          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              // Responsive
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {/* when looking to our own profile */}
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {/* when looking to others profile */}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>

        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>

          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>

        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          color={"gray.light"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;

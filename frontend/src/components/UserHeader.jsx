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
import { FaLink } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

// Func. to show the "user" wise information
const UserHeader = ({ user }) => {
  // copy link logic
  const toast = useToast();

  // get the current logged in user info
  const currentUser = useRecoilValue(userAtom);

  // Custom hook for follow unfollow user
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

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

          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
        </Box>

        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              border={"1px solid gray"}
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

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
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
                <MenuList bg={"blue.200"}>
                  <MenuItem
                    fontWeight={"500"}
                    color={"black"}
                    bg={"blue.200"}
                    onClick={copyURL}
                  >
                    <Flex
                      w={"full"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Text>Copy Link</Text>
                      <FaLink />
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* when looking to our own profile */}
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update" style={{ width: "100%" }} p={2}>
          <Button size={"sm"} w={"full"} textAlign={"center"}>
            Update Profile
          </Button>
        </Link>
      )}

      {/* when looking to others profile */}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

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
      </Flex>
    </VStack>
  );
};

export default UserHeader;

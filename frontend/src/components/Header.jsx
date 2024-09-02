import {
  Button,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authSceenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authSceenAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {/* When user logged in */}
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("login")}
          fontWeight={"500"}
        >
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        w={6}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>

          <Menu>
            <MenuButton>
              <CgDetailsMore size={24} cursor={"pointer"} />
            </MenuButton>
            <Portal>
              <MenuList bg={"gray.200"}>
                <MenuItem
                  fontWeight={"500"}
                  color={"black"}
                  bg={"gray.200"}
                  as={RouterLink}
                  to={`/chat`}
                >
                  <BsFillChatQuoteFill
                    size={20}
                    style={{ marginRight: "8px" }}
                  />
                  Chat
                </MenuItem>
                <MenuItem
                  fontWeight={"500"}
                  color={"black"}
                  bg={"gray.200"}
                  as={RouterLink}
                  to={`/settings`}
                >
                  <MdOutlineSettings size={20} style={{ marginRight: "8px" }} />
                  Settings
                </MenuItem>
                <MenuItem
                  fontWeight={"500"}
                  color={"black"}
                  bg={"gray.200"}
                  onClick={logout}
                >
                  <FiLogOut size={18} style={{ marginRight: "8px" }} />
                  Logout
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
          fontWeight={"500"}
        >
          Sign Up
        </Link>
      )}
    </Flex>
  );
};

export default Header;

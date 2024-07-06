import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const Logout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      // Fetch Logout Api req.
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      // if no data, showing an error using toast notification
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // clearing the cookie from the user's local storage
      localStorage.removeItem("user-threads");

      // clearing from the state
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;

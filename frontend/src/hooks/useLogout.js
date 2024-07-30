import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const logout = async () => {
    try {
      // Fetch Logout API
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

      // updating the state with null as cookie gets destroyed
      setUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  return logout;
};

export default useLogout;

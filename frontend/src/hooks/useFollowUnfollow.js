import React, { useState } from "react";
import useShowToast from "./useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom);

  // State to check if currentUser is following the other users
  // toggling using the user's id is present in followers [].
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

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

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;

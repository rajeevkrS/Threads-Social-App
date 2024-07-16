import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  // it will run whenever the username changes
  useEffect(
    () => {
      // Creating the func.
      const getUser = async () => {
        try {
          // Fetch GET User Profile API
          const res = await fetch(`/api/users/profile/${username}`);

          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
          }

          //update the state
          setUser(data);
        } catch (error) {
          showToast("Error", error, "error");
        } finally {
          setLoading(false);
        }
      };

      // Calling the func.
      getUser();
    },
    [username],
    [showToast]
  );

  // if no user then loading
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // if no user and not loading
  if (!user && !loading) return <h1>User not found!</h1>;

  return (
    <>
      {/* sending user's infomation using props */}
      <UserHeader user={user} />

      <UserPost
        likes={1200}
        replies={481}
        postImg="/post1.png"
        postTitle="Lets talk about threds."
      />

      <UserPost
        likes={10}
        replies={41}
        postImg="/post2.png"
        postTitle="Nice tutorial"
      />

      <UserPost
        likes={200}
        replies={48}
        postImg="/post3.png"
        postTitle="I live this guy."
      />

      <UserPost likes={120} replies={41} postTitle="This is my first thread." />
    </>
  );
};

export default UserPage;

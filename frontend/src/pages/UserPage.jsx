import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);

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
          showToast("Error", error.message, "error");
        } finally {
          setLoading(false);
        }
      };

      // Creating the func.
      const getPosts = async () => {
        setFetchingPosts(true);

        try {
          // Fetch Posts by searching by Username
          const res = await fetch(`/api/posts/user/${username}`);
          const data = await res.json();
          console.log(data);

          //update the state
          setPosts(data);
        } catch (error) {
          showToast("Error", error.message, "error");
          // clearing the state
          setPosts([]);
        } finally {
          setFetchingPosts(false);
        }
      };

      // Calling the func.
      getUser();
      getPosts();
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

      {/* User's Posts */}
      {!fetchingPosts && posts.length === 0 && (
        <Flex justifyContent={"center"} my={12}>
          <h1>User has no posts.</h1>
        </Flex>
      )}

      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;

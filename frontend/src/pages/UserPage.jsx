import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  // it will run whenever the username changes
  useEffect(() => {
    const getPosts = async () => {
      // if user is null
      if (!user) return;

      setFetchingPosts(true);

      try {
        // Fetch Posts by searching by Username
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();

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
    getPosts();
  }, [username, showToast, setPosts, user]);

  // if no user when landing to the page, for the while show loading
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // if no user and not loading
  if (!user && !loading)
    return (
      <Text fontWeight={"bold"} textAlign={"center"}>
        User not found!
      </Text>
    );

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

import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const [showSuggestedUsers, setShowSuggestedUsers] = useState(false);

  // Display posts of the users the current user follows
  useEffect(() => {
    // Fetch Feed Posts API req
    const getFeedPosts = async () => {
      setLoading(true);

      // prevent from flickering bug
      setPosts([]);

      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // updating the state
        setPosts(data);

        // Show SuggestedUsers if there is 0 or 1 post
        if (data.length === 0) {
          setShowSuggestedUsers(true);
        }

        if (data.length > 0) {
          setShowSuggestedUsers(true);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <Text align={"center"} fontWeight={"bold"}>
            Follow some users to see the feed!
          </Text>
        )}

        {loading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}

        {/* Render the first post */}
        {posts.length > 0 && (
          <Post
            key={posts[0]._id}
            post={posts[0]}
            postedBy={posts[0].postedBy}
          />
        )}

        {/* Mobile Screen view - between the posts */}
        <Box
          flex={30}
          display={{
            base: "block",
            md: "none",
          }}
        >
          <Divider mt={5} mb={5} borderColor={"red"} />

          {/* Show SuggestedUsers after the first post */}
          {showSuggestedUsers && <SuggestedUsers />}

          <Divider mt={5} borderColor={"red"} />
        </Box>

        {/* Render the rest of the posts */}
        {posts.slice(1).map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>

      {/* Desktop Screen view - Right side */}
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;

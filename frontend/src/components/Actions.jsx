import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";

// Renamed post as "post_"
const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  // "post_.likes.includes(user?._id)" checks if the current user's ID (user?._id) is present in the post_.likes array.
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [posts, setPosts] = useRecoilState(postAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");

  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLikeAndUnlike = async () => {
    if (!user) {
      showToast("Error", "Login First!", "error");
      return;
    }

    // after clicking on like icon if liking the post takes time then return out of handleLikeAndUnlike Func.
    if (isLiking) return;

    // if not liking
    setIsLiking(true);

    try {
      // Fetch Like and Unlike API
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // check and updating the state
      if (!liked) {
        // Like the Post Logic:
        // If the user has not liked the post yet then liking.
        // add the id of the current user to post.likes array.

        // Inside posts array, going to find the posts thats have liking and then add the id of the current user's id into a likes array.
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            // { ...p } creates a shallow copy of the current post object.
            // likes: [...p.likes, user._id] updates the likes property of the post. It creates a new array that includes all existing likes (...p.likes) and adds the current user's ID (user._id) to the end of the array.
            // return { ...p, likes: [...p.likes, user._id] }; returns the updated post object.
            return { ...p, likes: [...p.likes, user._id] };
          }

          // If the current post's ID does not match the post._id, it returns the post unchanged.
          return p;
        });

        // updating the state
        setPosts(updatedPosts);
      } else {
        // Unlike the Post Logic:
        // If the user has already liked the post then unliking
        // remove the id of the current user from post.likes array.
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            // likes: p.likes.filter((id) => id !== user._id) updates the likes property of the post. The filter method creates a new array that includes all likes except the one matching the current user's ID (user._id).
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }

          return p;
        });

        setPosts(updatedPosts);
      }

      // toggling the state
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user) {
      showToast("Error", "Login First!", "error");
      return;
    }

    // after clicking on reply icon if replying on the post takes time then return out of handleReply Func.
    if (isReplying) return;

    // if not replying
    setIsReplying(true);

    try {
      // Fetch Post Reply API
      const res = await fetch(`/api/posts/reply/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // updating the state
      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          // replies: [...p.replies, data] updates the replies property of the post. It creates a new array that includes all existing replies (...p.replies) and adds the new reply (data) to the end of the array.
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });

      setPosts(updatedPosts);

      showToast("Success", "Reply posted successfully!", "success");

      // closing the modal after clicking reply button
      onClose();

      // clearing the state
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Flex flexDirection={"column"}>
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          cursor={"pointer"}
          onClick={handleLikeAndUnlike}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          cursor={"pointer"}
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Repost"
          color="currentColor"
          fill="currentColor"
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          cursor={"pointer"}
        >
          <title>Repost</title>
          <path
            fill=""
            d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
          ></path>
        </svg>

        <svg
          aria-label="Share"
          color=""
          fill="rgb(243, 245, 247)"
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          cursor={"pointer"}
        >
          <title>Share</title>
          <line
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="22"
            x2="9.218"
            y1="3"
            y2="10.083"
          ></line>
          <polygon
            fill="none"
            points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></polygon>
        </svg>
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.replies.length} replies
        </Text>

        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>

        <Text color={"gray.light"} fontSize={"sm"}>
          {post.likes.length} likes
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Reply goes here.."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="blue"
              mr={3}
              onClick={handleReply}
              isLoading={isReplying}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;

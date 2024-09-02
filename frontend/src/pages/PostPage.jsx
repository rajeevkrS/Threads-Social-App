import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postAtom from "../atoms/postAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  // setting the first
  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      // prevent from flickering bug
      setPosts([]);

      try {
        // Fetch GET Post API
        const res = await fetch(`/api/posts/${pid}`);

        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        //updating the state
        setPosts([data]);
      } catch (error) {
        showToast("Errpr", error.message, "error");
      }
    };

    getPost();
  }, [showToast, pid, setPosts]);

  //
  const handleDeletePost = async () => {
    try {
      // warning before deleting
      if (!window.confirm("Are you sure?")) return;

      // Fetch Delete Post API
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted!", "success");

      // after delete, navigate to their user profile
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  // if no user when landing to the page, for the while show loading
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user.profilePic}
            size={"md"}
            cursor={"pointer"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />

          <Flex>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              cursor={"pointer"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {user.username}
            </Text>
            <Text fontSize={"xm"} w={36} ml={3} color={"gray.light"}>
              {/* current time of the post */}
              {format(new Date(currentPost.createdAt), "MM/dd/yyyy")}
            </Text>
          </Flex>
        </Flex>

        <Flex alignItems={"center"}>
          {currentUser?._id === user._id && (
            <DeleteIcon
              cursor={"pointer"}
              size={20}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;

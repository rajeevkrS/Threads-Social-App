import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />

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

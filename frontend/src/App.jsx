import { Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import Headers from "./components/Header";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW="620px">
      <Headers />
      <Routes>
        {/* if user cookie available, sends user to Homepage else navigated to auth route */}
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to={"/auth"} />}
        />

        {/* if user cookie not available, sends user to AuthPage else navigated to home route */}
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to={"/"} />}
        />

        {/* if user cookie available, sends user to UpdateProfilePage else navigated to auth route */}
        <Route
          path="/update"
          element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
        />

        {/* if user logged in, then show Create post button and UserPage component else only UserPage component */}
        <Route
          path="/:username"
          element={
            user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          }
        />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

      {/* if user logged in, then show logout component */}
    </Container>
  );
}

export default App;

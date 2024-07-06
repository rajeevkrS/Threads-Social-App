import { Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import Headers from "./components/Header";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import Logout from "./components/Logout";

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);

  return (
    <Container maxW="620px">
      <Headers />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to={"/"} />}
        />

        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

      {user && <Logout />}
    </Container>
  );
}

export default App;

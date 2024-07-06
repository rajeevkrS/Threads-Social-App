import { Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Headers from "./components/Header";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Container maxW="620px">
      <Headers />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;

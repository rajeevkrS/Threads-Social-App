import { Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Headers from "./components/Header";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Container maxW="620px">
      <Headers />
      <Routes>
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;

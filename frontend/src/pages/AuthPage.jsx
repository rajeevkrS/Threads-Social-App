import { useRecoilValue } from "recoil";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import authSceenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authSceenAtom);
  return <>{authScreenState === "login" ? <Login /> : <SignUp />}</>;
};

export default AuthPage;

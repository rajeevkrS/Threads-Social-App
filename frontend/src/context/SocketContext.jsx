import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

// Creating a context
const SocketContext = createContext();

// Creating a hook
export const useSocket = () => {
  return useContext(SocketContext);
};

// Created a provider around it
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // useEffect initializes the socket connection whenever user._id changes.
  useEffect(() => {
    //backend url
    const socket = io(import.meta.env.VITE_APP_BACKEND_URL, {
      // socket connection includes a query parameter with the user's ID that sends the user's ID (if it exists) to the server. This allows the server to identify which user is connecting.
      query: {
        userId: user?._id,
      },
    });

    // storing the socket instance in the state, it can be accessed and used throughout the component.
    setSocket(socket);

    //This sets up an event listener on the socket to listen for the getOnlineUsers event emitted by the server.
    // When the getOnlineUsers event is received, the users parameter (which contains the list of online users) is used to update the onlineUsers state.
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Cleanup function to close socket connection on unmount
    return () => socket && socket.close();
  }, [user?._id]);

  // console.log("online users", onlineUsers);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

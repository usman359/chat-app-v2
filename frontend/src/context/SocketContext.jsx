import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  const isDevelopment = import.meta.env.DEV; // true in development, false in production

  useEffect(() => {
    if (authUser) {
      const socket = io(
        isDevelopment
          ? "http://localhost:8000"
          : "https://chat-app-v2-gpwy.onrender.com",
        {
          query: { userId: authUser._id },
        }
      );
      setSocket(socket);

      // socket.on() is used to listen to the events. Can be used both on the server and client
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { socket } = useSocketContext();

  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  // Listen for new users
  useEffect(() => {
    if (!socket) return;

    socket.on("newUser", async () => {
      // Fetch updated user list when a new user joins
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        console.error("Error fetching updated user list:", error);
      }
    });

    return () => {
      socket.off("newUser");
    };
  }, [socket]);

  return { loading, conversations };
};

export default useGetConversations;

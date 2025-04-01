import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({ username, password }) => {
    const success = handleInputErrors({ username, password });

    if (!success) return;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // set the user in the local storage
      localStorage.setItem("chat-user", JSON.stringify(data));

      // update the context
      setAuthUser(data);

      toast.success("Login successful");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

const handleInputErrors = ({ username, password }) => {
  if (!username || !password) {
    toast.error("All fields are required");
    return false;
  }

  return true;
};

export default useLogin;

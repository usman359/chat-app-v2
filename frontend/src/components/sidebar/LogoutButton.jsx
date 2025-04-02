import React from "react";
import { LogOut } from "lucide-react";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { logout, loading } = useLogout();

  return (
    <div className="mt-auto px-[8px] py-[18px] sm:py-[12px]">
      {!loading ? (
        <button
          onClick={logout}
          className="p-2 hover:bg-sky-500 rounded-full transition-colors"
        >
          <LogOut className="w-5 h-5 text-white" />
        </button>
      ) : (
        <span className="loading loading-spinner"></span>
      )}
    </div>
  );
};

export default LogoutButton;

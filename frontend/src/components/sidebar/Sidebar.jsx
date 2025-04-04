import React from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 flex flex-col h-full w-[70px] sm:w-[300px]">
      <div className="p-2 sm:p-4">
        <SearchInput />
        <div className="divider my-2 sm:my-4"></div>
        <Conversations />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;

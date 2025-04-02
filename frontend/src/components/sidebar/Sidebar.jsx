import React from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 px-2 sm:px-4 flex flex-col w-[70px] sm:w-[300px]">
      <SearchInput />
      <div className="divider my-2 sm:my-4"></div>
      <Conversations />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;

import React from "react";
import Navbar from "./navbar";
// import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex flex-col w-full">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

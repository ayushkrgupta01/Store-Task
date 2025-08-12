"use client";
import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

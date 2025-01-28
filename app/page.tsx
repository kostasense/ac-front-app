"use client";

import React from "react";
import SearchForm from "./components/SearchForm";

const Home: React.FC = () => {
  return (
    <main className="flex">
      <div className="container mx-auto p-4">
        <SearchForm />
      </div>
    </main>
  );
};

export default Home;
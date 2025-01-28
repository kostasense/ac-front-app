"use client";

import React, { createContext, useState } from 'react';

const MyContext = createContext();

const MyContextProvider = ({ children }) => {
    
  const [days, setDays] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [ages, setAges] = useState([""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <MyContext.Provider value={{ days, setDays, passengers, setPassengers, ages, setAges, startDate, setStartDate, endDate, setEndDate }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
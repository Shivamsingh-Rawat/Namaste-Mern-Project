import React from "react";
import Namaste_Logo from "../Images/Namaste_Logo.png";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  return (
    <div div className={"welcome-container" + (lightTheme? "" : " dark")}>
      
     <motion.img drag
        whileTap={{ scale: 1.05, rotate: 360 }} src={Namaste_Logo} alt="logo" className="welcome-logo" />  
        <b>Hi , {userData.data.name} 👋</b>  
      <p> View and Text directly to people present in the Chat Rooms.</p>
    </div>
  );
}
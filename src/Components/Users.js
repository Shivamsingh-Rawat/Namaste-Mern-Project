import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import RefreshIcon from "@mui/icons-material/Refresh";
import Namaste_Logo from "../Images/Namaste_Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

export default function Users() {
  const { refresh, setRefresh } = useContext(myContext);

  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));const nav = useNavigate();
  const dispatch = useDispatch();

  if (!userData) {
    console.log("User not Authenticated");
    nav(-1);
  }

  useEffect(() => {
    console.log("Users refreshed");
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
    axios.get("http://localhost:5000/user/fetchUsers", config).then((data) => {
      console.log("UData refreshed in Users panel ");
      setUsers(data.data);
    });
  }, [refresh]);

  return (
    <AnimatePresence>
     <motion.div  initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: "0.3",
        }} className="list-container">
      <div className={"ughead"+ (lightTheme ? "" : " dark")}>
      <img src={Namaste_Logo}  style={{height:"4rem",width:"4rem",marginLeft:"10px"}} alt="logo" />
      <p className={"ugtitle"+ (lightTheme ? "" : " dark")}>Available Users</p>
      <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
      </div>
      <div className={"sbsearch" + (lightTheme ? "" : " dark")}>
      <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
        <SearchIcon />
      </IconButton>
        <input placeholder="Search" className={"searchbox" + (lightTheme ? "" : " dark")}/>
      </div>
      <div className="ug-list">
      {users.map((user, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"list-item" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", user.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.data.token}`,
                    },
                  };
                  axios.post(
                    "http://localhost:5000/chat/",
                    {
                      userId: user._id,
                    },
                    config
                  );
                  dispatch(refreshSidebarFun());
                }}
              >
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>{user.name[0]}</p>
          <p className={"con-title" + (lightTheme ? "" : " dark")}>{user.name}</p>
         </motion.div>
                     );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          }


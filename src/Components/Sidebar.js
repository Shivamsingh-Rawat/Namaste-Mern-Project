import React, {useContext, useEffect, useState } from 'react';
import "./myStyles.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import axios from "axios";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  
  const { refresh, setRefresh } = useContext(myContext);
  console.log("Context API : refresh : ", refresh);
  const [conversations, setConversations] = useState([]);
 
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    console.log("User not Authenticated");
    navigate("/");
  }

  const user = userData.data;
  useEffect(() => {

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios.get("http://localhost:5000/chat/", config).then((response) => {
      console.log("Data refresh in sidebar ", response.data);
      setConversations(response.data);
    });
  }, [refresh]);
  
  return (
   <div className="sidebr">
    <div className={"sbhead" + (lightTheme? "" : " dark" )}>
      <div className="other-icons">
         <IconButton  onClick={() => {
              navigate("/app/welcome");
          }}>
            <AccountCircleIcon className={"icon" + (lightTheme? "" : " dark" )}/>
         </IconButton>
     
         <IconButton onClick={() =>{navigate("users");}}>
            <PersonAddIcon className={"icon" + (lightTheme? "" : " dark" )}/>
         </IconButton>
         <IconButton onClick={() =>{navigate("groups");}}>
            <GroupAddIcon className={"icon" + (lightTheme? "" : " dark" )}/>
         </IconButton>
         <IconButton onClick={() =>{navigate("create-groups");}}>
            <AddCircleIcon className={"icon" + (lightTheme? "" : " dark" )} />
         </IconButton>

         <IconButton onClick={()=>{dispatch(toggleTheme());}}>
             {lightTheme && (<NightlightIcon className={"icon" + (lightTheme? "" : " dark" )}/>)}
             {!lightTheme && (<LightModeIcon className={"icon" + (lightTheme? "" : " dark" )}/>)}
         </IconButton>
         <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
             <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
      </div>
    </div>

    <div className={"sbsearch" + (lightTheme? "" : " dark" )}>
      <IconButton  className={"icon" + (lightTheme? "" : " dark" )}>
        <SearchIcon />
      </IconButton>
        <input placeholder="Search" className={"searchbox" + (lightTheme? "" : " dark" )}/>
    </div>
    <div className={"sbcon" + (lightTheme? "" : " dark" )}>
       {conversations.map((conversation, index) => {
          if (conversation.users.length === 1) {
              return <div key={index}></div>;
          }
          if (conversation.latestMessage === undefined) {
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                  setRefresh(!refresh);
                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    navigate(
                      "chat/" +
                        conversation._id +
                        "&" +
                        conversation.users[1].name
                    );
                  }}
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                    {conversation.users[1].name[0]}
                  </p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                    {conversation.users[1].name}
                  </p>

                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>
                  <p className={"con-timeStamp" + (lightTheme ? "" : "dark")}>
                    {conversation.timeStamp}
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate(
                    "chat/" +
                      conversation._id +
                      "&" +
                      conversation.users[1].name
                  );
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {conversation.users[1].name[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {conversation.users[1].name}
                </p>

                <p className="con-lastMessage">
                  {conversation.latestMessage.content}
                </p>
                 <p className={"con-timeStamp" + (lightTheme ? "" : "dark")}>
                    {conversation.timeStamp}
                 </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}


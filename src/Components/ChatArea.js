import React,{ useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import MessageOthers from "./MessageOthers";
import MessageSelf from "./messageSelf";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

var socket, chat;

export default function ChatArea() {
   const lightTheme = useSelector((state) => state.themeKey);
   const [messageContent, setMessageContent] = useState("");
   const messagesEndRef = useRef(null);
   const dyParams = useParams();
   const [chat_id, chat_user] = dyParams._id.split("&");
  

   const userData = JSON.parse(sessionStorage.getItem("userData"));
   const [allMessages, setAllMessages] = useState([]);
   const [allMessagesCopy, setAllMessagesCopy] = useState([]);

   const { refresh, setRefresh } = useContext(myContext);
 
   const [loaded, setloaded] = useState(false);
   const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

   
    const sendMessage = () => {
      var data = null ;
      const config = {
       headers: {
         Authorization: `Bearer ${userData.data.token}`,
        },
      };
      axios
        .post(
           "http://localhost:5000/message/",
           {
               content: messageContent,
               chatId: chat_id,
           },
           config
        )
        .then(({ response }) => {
          data = response;
          console.log("Message Fired");
        });
      socket.emit("newMessage", data);
    };
    
    //connect to socket
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", userData);
      socket.on("connection", () => {
        setSocketConnectionStatus(!socketConnectionStatus);
      });
    }, []);
    
    // new message recieved  
    useEffect(() => {
      socket.on( (newMessage) => {
        if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id){
          
        }else{
          setAllMessages([...allMessages], newMessage);
        }
      });
    });
    //fetch Chat
    useEffect(() => { 
      const config = {
        headers: {
          Authorization: `Bearer ${userData?.data.token}`,
        },
      };
       axios
       .get("http://localhost:5000/message/" + chat_id, config)
       .then(({ data }) => {
         setAllMessages(data);
         setloaded(true);
         socket.emit("Join Chat", chat_id);
       });
       setAllMessagesCopy(allMessages);
     },[refresh , chat_id, userData?.data.token, allMessages]);


  if (!loaded) {
    return (
        <div
          style={{
            border: "20px",
            padding: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
         <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
         />
         <Skeleton
           variant="rectangular"
           sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
           }}
          />
          <Skeleton
           variant="rectangular"
           sx={{ width: "100%", borderRadius: "10px" }}
           height={60}
          />
        </div>
    )
  }else{
     return(
       <div className={"chAr-container" + (lightTheme ? "" : " dark")}>
        <div className={"chAr-Header" + (lightTheme ? "" : " dark")}>
             <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                {chat_user[0]}
             </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
             <p className={"con-title" + (lightTheme ? "" : " dark")}>
               {chat_user}
             </p>
          </div>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={"msg-container" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
               return <MessageSelf props={message} key={index} />;
              } else {
               return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />

     
        <div className={"text-in-area" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
               sendMessage();
               setMessageContent("");
               setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
       </div>
     );
   }
};
      

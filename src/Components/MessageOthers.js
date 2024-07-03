import React from "react";
import "./myStyles.css";
import { useDispatch, useSelector } from "react-redux";

export default function MessageOthers( {props} ) {
   const dispatch = useDispatch();
   const lightTheme = useSelector((state) => state.themeKey);
     
  return (
    <div className={"other-msg-container"+ (lightTheme ? "" : " dark")}>
       <div className={"conver-container"+ (lightTheme ? "" : " dark")}>
          <p className={"con-icon"+ (lightTheme ? "" : " dark")}>{props.sender.name[0]}</p>
          <div className={"other-txt-container"+ (lightTheme ? "" : " dark")}>
             <p className={"con-title"+ (lightTheme ? "" : " dark")}>{props.sender.name}</p>
             <p className={"con-lastmsg"+ (lightTheme ? "" : " dark")}>{props.content}</p>
             {/* <p className="con-timeStamp">12:00am</p> */}
          </div>
       </div>
    </div>
  );
}

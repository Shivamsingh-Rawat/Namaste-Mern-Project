import React from "react";

export default function messageSelf( {props} ) {

 return(
    <div className="self-msg-container">
     <div className="msgBox">
      <p style={{ color: "black" }}>{props.content}</p>
      {/* <p className="self-timeStamp" style={{ color: "black" }}>12:00am</p> */}
     </div>
    </div>
  );
}
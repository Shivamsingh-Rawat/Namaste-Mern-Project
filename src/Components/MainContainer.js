import React, {createContext,useState} from 'react';
import "./myStyles.css";
import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

export const myContext = createContext();

export default function MainContainer() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);

  
  return (
    <div className={"mcontainer" + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
    </div>
  );
}

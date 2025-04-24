import { useSelector } from "react-redux";
import "./DashboardSideBar.css";
import { adminSideBarItems } from "../../muckData.jsx";
import { fetchUser } from "../../redux/apiCalls.js";
import { useEffect, useState } from "react";
const DashboardSideBar = ({ setActive }) => {
  const user = useSelector((stat) => stat.user.currentUser);



  return (
    <div className="DashboardSideBar">
      <div className="user">
        <div className="info">
          <h2>{user.username}</h2>
          <span>PRO</span>
        </div>
      </div>{" "}
      {adminSideBarItems.map((item, index) => {
        return (
          <div
            className="item"
            key={index}
            onClick={() => setActive(item.title)}
          >
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSideBar;

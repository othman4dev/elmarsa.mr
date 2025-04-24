import { useState } from "react";
import DashboardSideBar from "../../components/sideBarDashboard/DashboardSideBar";
import "./Dashboard.scss";
import UserTable from "../../components/userTable/UserTable";
import Analytics from "../../components/analitycs/Analytics";
import AdminCategory from "../../components/adminCategory/AdminCategory";
import ProductTable from "../../components/productTable/ProductTable";
import AdminSubCategory from "../../components/AdminSubCategory/AdminSubCategory";


const Dashboard = () => {
  const [active, setActive] = useState("Utilisateur");
  return (
    <div className="dashboard">
      <DashboardSideBar setActive={setActive} />
      <div className="content">
        {active === "Utilisateur" && <UserTable />}
        {active === "Product" && <ProductTable />}
        {active === "Analyse des données" && <Analytics />}
        {/* {active === "Categories" && <AdminCategory />} */}
        {active === "Categories" && <AdminSubCategory />}
      </div>
    </div>
  );
}

export default Dashboard;
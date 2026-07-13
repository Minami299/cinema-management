import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

import "./AdminDashboard.css";

const AdminLayout = () => {
  return (
    <div className="admin-root">
      <Sidebar />

      <main className="admin-main">
        <Topbar />

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

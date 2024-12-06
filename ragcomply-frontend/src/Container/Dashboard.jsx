import { React, useEffect, useState } from "react";

import axiosInstance from "../axiosInstance";
import PieCharts from "../component/PieCharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_circulars: 0,
    pending: 0,
    last_title: "",
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/dashboard");
      console.log(response.data);

      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Circular Status */}
      <div className="flex justify-between items-center">
        {/* Circular Issued */}
        <div className="rounded-3xl w-1/4 p-4 m-4 shadow-lg bg-slate-100">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Total Circulars</h1>
          </div>
          <div className="flex justify-center mt-4">
            <h1 className="text-3xl font-bold">
              {dashboardData.total_circulars}
            </h1>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-3xl w-1/4 p-4 m-4 shadow-lg bg-slate-100">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Pending Circulars</h1>
            <span className="text-sm text-gray-500">As of 20, Aug 2024</span>
          </div>
          <div className="flex justify-center mt-4">
            <h1 className="text-3xl font-bold">{dashboardData.pending}</h1>
          </div>
        </div>

        {/* Last Circulation Name */}
        <div className="rounded-3xl p-4 m-4 shadow-lg bg-slate-100">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Last Circular: </h1>
            <span className="text-xl text-gray-500">
              {dashboardData.last_title}
            </span>
          </div>
        </div>
      </div>

      <PieCharts />
    </div>
  );
};

export default Dashboard;

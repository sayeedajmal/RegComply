import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { React, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../axiosInstance";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieCharts = () => {
  const [circularStatus, setCircularStatus] = useState({
    compliant: 0,
    non_compliant: 0,
    action_required: 0,
  });

  const fetchStatus = async () => {
    try {
      const response = await axiosInstance.get("/circular-status");

      setCircularStatus(response.data);
    } catch (error) {
      console.error("Error fetching Status data:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const data = {
    datasets: [
      {
        data: [
          circularStatus.compliant,
          circularStatus.non_compliant,
          circularStatus.action_required,
        ],
        backgroundColor: [
          "rgba(76, 175, 80, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 205, 86, 0.7)",
        ],
        borderColor: [
          "rgba(76, 175, 80, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(76, 175, 80, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        hoverBorderColor: "black",
        hoverBorderWidth: 3,
        weight: 1,
      },
    ],
    labels: ["Compliant", "Non-Compliant", "Action Required"],
  };

  const options = {
    responsive: true,
    cutout: "75%",
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
      },
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 15,
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      datalabels: {
        color: "blue",
        font: {
          weight: "bold",
        },
        formatter: (value, context) => {
          let total = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.map((data) => {
            total += data;
          });
          let percentage = ((value / total) * 100).toFixed(2);
          return percentage + "%";
        },
        anchor: "center",
        align: "center",
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#fff",
        borderJoinStyle: "round",
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowBlur: 10,
        borderRadius: 10,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    rotation: -90,
    circumference: 360,
  };
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col p-4 border-slate-400 border-2 rounded-lg m-4">
        <div className="flex justify-between items-center mb-4">
          <h3>Circular Status</h3>
          <span>Issue Date</span>
        </div>
        <hr className="border-slate-400 my-4" />
        <div className="self-center">
          <Pie data={data} options={options} />
        </div>
      </div>
      <div className="flex-1 p-4 border-slate-400 border-2 rounded-lg m-4 h-[40vh] overflow-auto">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          themeSystem="Sandstone"
          events={[
            { title: "Event 1", date: "2024-12-15" },
            { title: "Event 2", date: "2024-12-25" },
          ]}
        />
      </div>
    </div>
  );
};

export default PieCharts;

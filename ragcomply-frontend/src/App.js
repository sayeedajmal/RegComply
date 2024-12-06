import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaBook,
  FaClipboardList,
  FaFilter,
  FaRegPaperPlane,
  FaTachometerAlt,
  FaUpload,
} from "react-icons/fa";
import Circular from "./Container/Circular";
import Dashboard from "./Container/Dashboard";
import Uploads from "./Container/Uploads";

function App() {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [startDate, setStartDate] = useState(null);

  const handleClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="flex flex-row">
      <div className="flex h-screen w-1/5 flex-col text-black">
        {/* Searchbar */}
        <input placeholder="Search" className="p-4 m-2 bg-slate-100 rounded-lg" />

        {/* Sidepanel Label */}
        <ul className="font-semibold text-2xl mt-8 m-4">
          <li
            className={`py-4 px-3 cursor-pointer m-2 flex items-center rounded-2xl ${selectedSection === "dashboard" ? "bg-slate-200" : ""
              }`}
            onClick={() => handleClick("dashboard")}
          >
            <FaTachometerAlt className="mr-3" /> Dashboard
          </li>
          <li
            className={`py-4 px-3 cursor-pointer m-2 flex items-center rounded-2xl ${selectedSection === "circulars" ? "bg-slate-200" : ""
              }`}
            onClick={() => handleClick("circulars")}
          >
            <FaRegPaperPlane className="mr-3" /> Circulars
          </li>
          <li
            className={`py-4 px-3 cursor-pointer m-2 flex items-center rounded-2xl ${selectedSection === "actionables" ? "bg-slate-200" : ""
              }`}
            onClick={() => handleClick("actionables")}
          >
            <FaClipboardList className="mr-3" /> Actionables
          </li>
          <li
            className={`py-4 px-3 cursor-pointer m-2 flex items-center rounded-2xl ${selectedSection === "library" ? "bg-slate-200" : ""
              }`}
            onClick={() => handleClick("library")}
          >
            <FaBook className="mr-3" /> Library
          </li>
          <li
            className={`py-4 px-3 cursor-pointer m-2 flex items-center rounded-2xl ${selectedSection === "upload" ? "bg-slate-200" : ""
              }`}
            onClick={() => handleClick("upload")}
          >
            <FaUpload className="mr-3" /> upload
          </li>
        </ul>
      </div>

      {/* Main Container */}
      <div className="flex-1 h-screen p-4 bg-slate-50">
        {/* SearchBar And Filters */}
        <div className="flex justify-between items-center">
          {/* Filter Input with Icon */}
          <div className="flex items-center border-2 border-gray-300 rounded-full p-2 w-1/2">
            <input
              type="text"
              placeholder="SQL Style multiColumn Filter"
              className="outline-none p-2 w-full placeholder:font-semibold placeholder:text-xl bg-transparent"
            />
            <FaFilter className="text-gray-500 mx-2" />
          </div>

          {/* Calendar Picker */}
          <div className="ml-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border-2 border-gray-300 p-2 rounded-lg"
              placeholderText="Pick a Date"
            />
          </div>
        </div>
        {selectedSection === "dashboard" && <Dashboard />}
        {selectedSection === "upload" && <Uploads />}
        {selectedSection === "circulars" && <Circular />}
      </div>
    </div>
  );
}

export default App;

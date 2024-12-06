import React, { useState } from "react";

const CircularStrip = ({ Circular }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showClauses, setShowClauses] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleClauses = () => {
    setShowClauses(!showClauses);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg shadow-orange-200 p-4 my-4 cursor-pointer"
      onClick={toggleExpand}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold -l-2 w-[67%]">{Circular.Title}</h2>
        <div className="flex space-x-2 text-sm h-[1.8rem] overflow-hidden text-center">
          <span className="bg-blue-100 px-2 py-0 rounded-full content-center text-blue-500">
            {Circular.regulator_name}
          </span>
          <span className="bg-green-100 px-2 py-1 rounded-full content-center text-green-500">
            {Circular.method_of_communication}
          </span>
          <span className="bg-yellow-100 px-2 py-1 rounded-full content-center text-yellow-800">
            {Circular.business_process_status}
          </span>
          <span className="bg-red-100 px-2 py-1 rounded-full content-center text-red-800">
            {Circular.affected_business_process}
          </span>
        </div>
      </div>
      <hr className="border-slate-400 my-4" />
      <p className="text-gray-600 ">Circular ID: {Circular.id}</p>
      <div className="flex items-center">
        <span className="font-bold text-lg">Common tags:</span>
        <span className="px-2 py-1 text-sm rounded-full ml-2 bg-[#1a9e9c] text-white">
          {Circular.common_tags}
        </span>
      </div>
      <div>
        <span className="font-bold text-lg">Issued On:</span>
        <span className="ml-2">{Circular.Issued}</span>
      </div>
      <div>
        <span className="font-bold text-lg">Due On:</span>
        <span className="ml-2">{Circular.Due}</span>
      </div>

      {isExpanded && (
        <div className="mt-4 transition-all duration-500 ease-in-out opacity-100 max-h-screen overflow-hidden">
          <span className="font-bold text-lg transition-all duration-500 ease-in-out opacity-100">
            AI Summary:
          </span>
          <p className="text-gray-600 mt-2 transition-all duration-500 ease-in-out opacity-100 font-semibold">
            {Circular.ai_summary}
          </p>
          <div className="flex justify-end m-4">
            <button className="border-2 border-[#106b69] p-2 rounded-xl mx-3 text-[#106b69]">
              Send Email
            </button>
            <button
              className="border-2 border-[#106b69] p-2 rounded-xl bg-[#106b69] text-white"
              onClick={toggleClauses}
            >
              View All Clauses
            </button>
          </div>
        </div>
      )}

      {showClauses && (
        <div className="border-2 border-[#1a9e9c] rounded-lg shadow-lg p-2">
          <table className="min-w-full border-collapse">
            <thead className="text-2xl h-[4rem] bg-[#a9e0d9] text-[#2c3e50]">
              <tr>
                <th className="border-l-2 border-[#8df8f6] px-6 py-3 text-left font-semibold">
                  Clause No
                </th>
                <th className="border-l-2 border-[#8df8f6] px-6 py-3 text-left font-semibold">
                  Clause Content
                </th>
                <th className="border-l-2 border-[#8df8f6] px-6 py-3 text-left font-semibold">
                  Actionables
                </th>
                <th className="border-l-2 border-[#8df8f6] px-6 py-3 text-left font-semibold">
                  Department Name
                </th>
              </tr>
            </thead>
            <tbody>
              {Circular.clauses.map((clause, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-300 ease-in-out ${
                    index % 2 === 0 ? "bg-[#f0f8ff]" : "bg-white"
                  } hover:bg-[#f1f8fc]`}
                >
                  <td className="border-l-2 border-[#8df8f6] px-6 py-4">
                    {index + 1}
                  </td>
                  <td className="border-l-2 border-[#8df8f6] px-6 py-4">
                    {clause.content}
                  </td>
                  <td className="border-l-2 border-[#8df8f6] px-6 py-4">
                    {clause.actionable}
                  </td>
                  <td className="border-l-2 border-[#8df8f6] px-6 py-4 justify-items-center">
                    <h3 className="rounded-full border-2 border-[#1a9e9c] text-center p-2 text-[10px] w-fit font-mono text-[#2c3e50] uppercase">
                      {clause.department}
                    </h3>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CircularStrip;

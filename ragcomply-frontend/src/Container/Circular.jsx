import React, { useState, useEffect } from "react";
import CircularStrip from "../component/CircularStrip";
import axiosInstance from "../axiosInstance";

const Circular = () => {
  const [allCirculars, setAllCirculars] = useState([]); 

  const fetchAllCircular = async () => {
    try {
      const response = await axiosInstance.get("/circulars");
      setAllCirculars(response.data); 
    } catch (error) {
      console.error("Error fetching circulars data:", error);
    }
  };

  useEffect(() => {
    fetchAllCircular();
  }, []);

  return (
    <div>
      {allCirculars.map((circular) => (
        <CircularStrip key={circular.id} Circular={circular} /> 
      ))}
    </div>
  );
};

export default Circular;

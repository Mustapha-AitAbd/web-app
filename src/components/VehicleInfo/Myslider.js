import React, { useState } from "react";


const Myslider = () => {
  const [value, setValue] = useState(50); 

  const getColor = () => {
    if (value < 33) {
      return "red"; 
    } else if (value < 67) {
      return "yellow"; 
    } else {
      return "green"; 
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-value" style={{ color: getColor() }}>
      </div>
      <div className="slider"/>
      

    </div>
  );
};

export default Myslider;

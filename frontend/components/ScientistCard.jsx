import React from "react";
import "./ScientistCard.css";

const ScientistCard = ({ name, field, achievement }) => {
  return (
    <div className="scientist-card">
      <h2>{name}</h2>
      <p><strong>Field:</strong> {field}</p>
      <p><strong>Achievement:</strong> {achievement}</p>
    </div>
  );
};

export default ScientistCard;

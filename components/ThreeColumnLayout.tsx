import React from "react";

interface ThreeColumnLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  left,
  center,
  right,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        marginTop: "50px",
        gap: "40px",
        width: "100%",
        maxWidth: "1400px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>{left}</div>
      <div style={{ width: "100%", maxWidth: "400px" }}>{center}</div>
      <div style={{ width: "100%", maxWidth: "400px" }}>{right}</div>
    </div>
  );
};

export default ThreeColumnLayout;

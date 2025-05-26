import React from "react";

interface AiSearchResultsProps {
  onRequest: () => void;
  response: string;
  disabled: boolean;
  loading: boolean;
}

const AiSearchResults: React.FC<AiSearchResultsProps> = ({
  onRequest,
  response,
  disabled,
  loading,
}) => {
  const lines = response
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px 30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ marginBottom: "20px", color: "#444" }}>AI 검색 결과</h3>

      <button
        onClick={onRequest}
        disabled={disabled || loading}
        style={{
          padding: "12px 20px",
          backgroundColor: disabled || loading ? "#ccc" : "#007fff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: disabled || loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        {loading ? "생성 중..." : "Gemini 제목 생성"}
      </button>

      {loading ? (
        <div style={{ color: "#007fff", fontSize: "14px" }}>로딩 중...</div>
      ) : (
        lines.length > 0 && (
          <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#333" }}>
            {lines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default AiSearchResults;

import React from "react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>⚠ 에러 발생</h3>
        <pre style={styles.message}>{message}</pre>
        <button style={styles.button} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "30px 40px",
    maxWidth: "500px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  title: {
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "18px",
    color: "#c00",
  },
  message: {
    whiteSpace: "pre-wrap",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#333",
  },
  button: {
    backgroundColor: "#007fff",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ErrorModal;

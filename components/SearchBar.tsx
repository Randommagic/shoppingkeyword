import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        🔍
      </button>
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    maxWidth: "500px",
  },
  input: {
    flex: 1,
    padding: "14px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    outline: "none",
  },
  button: {
    padding: "14px 20px",
    backgroundColor: "#007fff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.2s",
  },
};

export default SearchBar;

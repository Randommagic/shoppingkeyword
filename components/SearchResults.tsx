import React from "react";

interface Item {
  title: string;
  link: string;
  price: string;
}

interface SearchResultsProps {
  items: Item[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ items }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>검색 결과</h3>
      {items.length === 0 ? (
        <p style={{ color: "#aaa" }}>검색 결과가 여기에 표시됩니다.</p>
      ) : (
        <ul style={styles.list}>
          {items.map((item, index) => (
            <li key={index} style={styles.item}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                <div style={styles.title}>{item.title}</div>
                <div style={styles.price}>{item.price}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px 30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    height: "100%",
    boxSizing: "border-box",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    color: "#444",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  link: {
    textDecoration: "none",
    color: "#222",
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: 500,
  },
  price: {
    color: "#007fff",
    fontWeight: "bold",
  },
};

export default SearchResults;

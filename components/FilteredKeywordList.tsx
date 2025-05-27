import React from "react";

interface Props {
  keywords: Record<string, number>;
}

const FilteredKeywordList: React.FC<Props> = ({ keywords }) => {
  const filteredList = getFilteredKeywords(keywords);

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>조합 키워드 제거 리스트</h3>
      {filteredList.length === 0 ? (
        <p style={{ color: "#aaa" }}>필터링된 키워드가 여기에 표시됩니다.</p>
      ) : (
        <ul style={styles.list}>
          {filteredList.map((word, idx) => (
            <li key={idx} style={styles.item}>
              <span>{word}</span>
              <span style={styles.count}>{keywords[word]}회</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function getFilteredKeywords(keywords: Record<string, number>): string[] {
  const uniqueWords = Object.keys(keywords);

  const filtered = uniqueWords.filter((word) => {
    const others = uniqueWords.filter((w) => w !== word);
    return !canBeComposed(word, others);
  });

  return filtered.sort((a, b) => keywords[b] - keywords[a]);
}

function canBeComposed(word: string, parts: string[]): boolean {
  const dp = Array(word.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= word.length; i++) {
    for (let part of parts) {
      if (
        i >= part.length &&
        dp[i - part.length] &&
        word.slice(i - part.length, i) === part
      ) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[word.length];
}

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
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
  },
  count: {
    color: "#007fff",
    fontWeight: "bold",
  },
};

export default FilteredKeywordList;

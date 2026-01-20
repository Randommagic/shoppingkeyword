import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import KeywordStats from "../components/KeywordStats";
import ErrorModal from "../components/ErrorModal";
import AiSearchResults from "../components/AiSearchResults";
import ThreeColumnLayout from "@/components/ThreeColumnLayout";
import FilteredKeywordList from "@/components/FilteredKeywordList";

interface Item {
  title: string;
  link: string;
  price: string;
}

export default function Home() {
  const [results, setResults] = useState<Item[]>([]);
  const [keywords, setKeywords] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>("");
  const [use3Bytes, setUse3Bytes] = useState<boolean>(false);
  // const [geminiOutput, setGeminiOutput] = useState<string>("");
  // const [geminiLoading, setGeminiLoading] = useState(false);

  // const handleGeminiClick = async () => {
  //   setError("");
  //   setGeminiOutput("");
  //   setGeminiLoading(true);

  //   try {
  //     const sortedKeywords = Object.entries(keywords)
  //       .sort((a, b) => b[1] - a[1])
  //       .slice(0, 15)
  //       .map(([word]) => word);

  //     const res = await fetch("/api/gemini", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ keywords: sortedKeywords }), // ← 키워드만 전달
  //     });

  //     if (!res.ok) {
  //       const errText = await res.text();
  //       throw new Error(`Gemini API Error: ${errText}`);
  //     }

  //     const data = await res.json();
  //     setGeminiOutput(data.text || "응답 없음");
  //   } catch (err: any) {
  //     console.error("Gemini 호출 실패:", err);
  //     setError(err.message);
  //   } finally {
  //     setGeminiLoading(false);
  //   }
  // };

  const getTopKeywordsText = (keywords: Record<string, number>): string => {
    const sorted = Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);
  
    if (sorted.length === 0) {
      console.log("⚠️ 키워드 데이터가 비어있습니다.");
      return "";
    }
  
    const getByteLength = (str: string): number => {
      if (use3Bytes) {
        // 한글자를 3바이트로 계산
        return str.split('').reduce((bytes, char) => {
          return bytes + (char.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/) ? 3 : 1);
        }, 0);
      } else {
        // 한글자를 2바이트로 계산
        return str.split('').reduce((bytes, char) => {
          return bytes + (char.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/) ? 2 : 1);
        }, 0);
      }
    };
  
    let result = sorted[0];
    let currentBytes = getByteLength(result);
  
    console.log(`[시작] 첫 번째 단어: "${result}" (${currentBytes} bytes)`);
  
    if (currentBytes > 50) {
      console.log("❌ 첫 단어부터 50바이트를 초과하여 첫 단어만 반환합니다.");
      return result;
    }
  
    for (let i = 1; i < sorted.length; i++) {
      const nextWord = sorted[i];
      const fullText = `${result} ${nextWord}`;
      const fullTextBytes = getByteLength(fullText);
  
      console.log(`[검사] 순서: ${i + 1}, 단어: "${nextWord}"`);
      console.log(`       예상 결과: "${fullText}" (${fullTextBytes} bytes)`);
  
      if (fullTextBytes > 50) {
        console.log(`🛑 중단: "${nextWord}"를 추가하면 50바이트를 초과함 (${fullTextBytes} bytes)`);
        break;
      }
  
      result = fullText;
      currentBytes = fullTextBytes;
      console.log(`✅ 추가완료: 현재 길이 ${currentBytes} bytes`);
    }
  
    console.log(`[최종 결과]: "${result}" (총 ${currentBytes} bytes)`);
    return result;
  };

  const handleSearch = async (keyword: string) => {
    setError("");
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `HTTP ${response.status} - ${response.statusText}\n\n${errText}`
        );
      }

      const data = await response.json();

      const cleanedItems: Item[] = data.items.map((item: any) => ({
        title: item.title.replace(/<[^>]*>?/g, ""),
        link: item.link,
        price: `${Number(item.lprice).toLocaleString()}원`,
      }));

      setResults(cleanedItems);

      const allWords = cleanedItems
        .flatMap((item) => item.title.split(/\s+/))
        .map((word) => word.trim().replace(/[^\w가-힣0-9]/g, ""))
        .filter((word) => {
          if (word === "") return false;
          if (word.length === 1) {
            return /^[a-zA-Z가-힣]$/.test(word); // 숫자 한 글자 제외
          }
          return true;
        });

      const freqMap: Record<string, number> = {};
      allWords.forEach((word) => {
        freqMap[word] = (freqMap[word] || 0) + 1;
      });

      setKeywords(freqMap);
    } catch (err: any) {
      console.error("에러 발생:", err);
      setError(err.message);
    }
  };

  const topKeywordsText = Object.keys(keywords).length > 0 ? getTopKeywordsText(keywords) : "";

  const handleCopy = async () => {
    if (topKeywordsText) {
      try {
        await navigator.clipboard.writeText(topKeywordsText);
        alert("클립보드에 복사되었습니다!");
      } catch (err) {
        console.error("복사 실패:", err);
        alert("복사에 실패했습니다.");
      }
    }
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />

      {topKeywordsText && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1400px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#444", whiteSpace: "nowrap" }}>
                제목:
              </span>
              <div
                style={{
                  flex: 1,
                  padding: "15px 20px",
                  backgroundColor: "#e8d5ff",
                  borderRadius: "8px",
                  border: "1px solid #d4b3ff",
                  color: "#333",
                }}
              >
                {topKeywordsText}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  padding: "15px 20px",
                  backgroundColor: "#007fff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#0066cc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#007fff";
                }}
              >
                복사
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontWeight: "bold", color: "#444", whiteSpace: "nowrap" }}>
                한글 한 글자당 몇 바이트로 계산?
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  padding: "4px",
                  gap: "4px",
                }}
              >
                <button
                  onClick={() => setUse3Bytes(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: !use3Bytes ? "#007fff" : "transparent",
                    color: !use3Bytes ? "#fff" : "#666",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  2바이트
                </button>
                <button
                  onClick={() => setUse3Bytes(true)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: use3Bytes ? "#007fff" : "transparent",
                    color: use3Bytes ? "#fff" : "#666",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  3바이트
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ThreeColumnLayout
        left={<SearchResults items={results} />}
        center={<KeywordStats keywords={keywords} />}
        right={<FilteredKeywordList keywords={keywords} />}
        // right={
        //   <AiSearchResults
        //     onRequest={handleGeminiClick}
        //     response={geminiOutput}
        //     disabled={Object.keys(keywords).length === 0}
        //     loading={geminiLoading}
        //   />
        //}
      />

      <ErrorModal message={error} onClose={() => setError("")} />
    </div>
  );
}

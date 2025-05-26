import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import KeywordStats from "../components/KeywordStats";
import ErrorModal from "../components/ErrorModal";
import AiSearchResults from "../components/AiSearchResults";
import "../styles/App.css";
import ThreeColumnLayout from "@/components/ThreeColumnLayout";

interface Item {
  title: string;
  link: string;
  price: string;
}

export default function Home() {
  const [results, setResults] = useState<Item[]>([]);
  const [keywords, setKeywords] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>("");
  const [geminiOutput, setGeminiOutput] = useState<string>("");
  const [geminiLoading, setGeminiLoading] = useState(false);

  const handleGeminiClick = async () => {
    setError("");
    setGeminiOutput("");
    setGeminiLoading(true);

    try {
      const sortedKeywords = Object.entries(keywords)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([word]) => word);

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: sortedKeywords }), // ← 키워드만 전달
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API Error: ${errText}`);
      }

      const data = await res.json();
      setGeminiOutput(data.text || "응답 없음");
    } catch (err: any) {
      console.error("Gemini 호출 실패:", err);
      setError(err.message);
    } finally {
      setGeminiLoading(false);
    }
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

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />

      <ThreeColumnLayout
        left={<SearchResults items={results} />}
        center={<KeywordStats keywords={keywords} />}
        right={
          <AiSearchResults
            onRequest={handleGeminiClick}
            response={geminiOutput}
            disabled={Object.keys(keywords).length === 0}
            loading={geminiLoading}
          />
        }
      />

      <ErrorModal message={error} onClose={() => setError("")} />
    </div>
  );
}

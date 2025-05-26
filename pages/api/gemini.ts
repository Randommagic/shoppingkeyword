import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keywords } = req.body;

  if (
    !Array.isArray(keywords) ||
    keywords.length === 0 ||
    keywords.some((k) => typeof k !== "string")
  ) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'keywords' in request body." });
  }

  const prompt = `
  다음은 쇼핑몰 검색 결과에서 자주 등장한 키워드 상위 15개입니다:
  
  ${JSON.stringify(keywords)}
  
  이 키워드들을 활용하여 실제 쇼핑몰에 어울리는 상품 제목을 총 10개 만들어주세요.
  
  조건:
  - 각 제목은 반드시 40~45바이트 사이여야 합니다.
  - 상위 5개 키워드는 메인 키워드로 간주하며, 제목 앞부분에 배치해 주세요.
  - 한 제목 안에 중복된 단어는 포함되지 않아야 합니다.
  - 제목은 3~6개의 키워드를 조합해도 좋습니다.
  - 제목에는 키워드 조합 외의 불필요한 단어나 설명이 포함되어서는 안 됩니다 (단, 후반부 5개 제외).
  - 출력은 각 제목을 줄 바꿈으로 구분해 주세요.
  
  생성 규칙:
  1. 앞의 5개 제목은 기존 키워드만 조합하여 생성해 주세요.
  2. 뒤의 5개 제목은 다음과 같이 구성해 주세요:
     - 제목 앞에는 메인 키워드(상위 5개 중 1개 이상)를 포함해 주세요.
     - 뒤에는 기존 키워드와 연관된 자연스러운 표현이나 설명 문구가 포함되어도 됩니다.
     - 예시: 산업용 고철/플라스틱 파쇄기: 강력한 분쇄력, 폐기물 처리
  
  예시 출력:
  음향판 흡음보드 확산룸 어쿠스틱 디퓨저  
  흡음판 확산보드 룸튜닝 사운드패널 음향  
  룸어쿠스틱 디퓨저 스튜디오 방음 보드 흡음  
  어쿠스틱디퓨저 흡음판 녹음실 룸튜닝 방음  
  사운드디퓨저 흡음판 확산판 룸 어쿠스틱  
  흡음보드 사운드패널: 소리 차단에 탁월  
  확산보드 룸튜닝: 왜곡 없는 음향 조절  
  어쿠스틱 디퓨저: 녹음실 전용 고급형  
  음향판 방음보드: 소음 감소에 최적  
  스튜디오 흡음판: 전문가용 룸 어쿠스틱
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate content", message: error?.message });
  }
}

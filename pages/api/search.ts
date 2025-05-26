import type { NextApiRequest, NextApiResponse } from "next";

type ErrorResponse = {
  error: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResponse> // <- 유연하게 처리
) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query parameter." });
  }

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(
        query
      )}&display=50`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID || "",
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET || "",
        },
      }
    );

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[API ERROR]", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error?.message ?? "Unknown error occurred",
    });
  }
}

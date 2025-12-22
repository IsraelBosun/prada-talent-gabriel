import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export async function POST(req) {
  try {
    const { query, limit = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Turn the Employer's Search into a Vector using Gemini
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(query);
    const queryVector = result.embedding.values;

    // 2. Query Pinecone for the top matches
    const index = pc.index("panda-talent");
    const queryResponse = await index.query({
      vector: queryVector,
      topK: limit,
      includeMetadata: true, // This gives us the name and title stored during indexing
    });

    // 3. Format the results
    const matches = queryResponse.matches.map((match) => ({
      id: match.id,
      score: (match.score * 100).toFixed(1), // Convert 0.856 to 85.6%
      ...match.metadata,
    }));

    return NextResponse.json({ success: true, matches });

  } catch (error) {
    console.error("AI Search Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
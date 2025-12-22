import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

// 1. Initialize AI and Vector DB
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export async function POST(req) {
  try {
    const candidateData = await req.json();
    const { userId, fullName, title, bio, skills, projects } = candidateData;

    // 2. Create a "Semantic String" 
    // We combine everything into one paragraph so the AI understands context.
    const projectSummary = projects.map(p => `${p.name}: ${p.description} using ${p.techStack.join(', ')}`).join('. ');
    
    const textToEmbed = `
      Name: ${fullName}
      Title: ${title}
      Bio: ${bio}
      Skills: ${skills.join(', ')}
      Projects: ${projectSummary}
    `.trim();

    // 3. Generate Embedding using Gemini
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(textToEmbed);
    const embedding = result.embedding.values;

    // 4. Upsert to Pinecone
    const index = pc.index("panda-talent"); // Ensure this matches your Pinecone index name
    await index.upsert([
      {
        id: userId,
        values: embedding,
        metadata: {
          fullName,
          title,
          skills: skills.join(', '),
          role: 'candidate'
        }
      }
    ]);

    return NextResponse.json({ success: true, message: "Candidate indexed for AI search" });

  } catch (error) {
    console.error("Indexing Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import axios from "axios";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const res = await axios.post(
      GEMINI_ENDPOINT,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.REACT_APP_GEMINI_API_KEY,
        },
      }
    );
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Error: Could not fetch AI response";
  }
}

export async function generateInterviewQuestions(resumeContent: string): Promise<any[]> {
  const prompt = `Based on the following resume content, generate exactly 6 interview questions:
  - 2 Easy questions (20 seconds each)
  - 2 Medium questions (60 seconds each)  
  - 2 Hard questions (120 seconds each)

  Resume: ${resumeContent}

  Return the questions in this exact JSON format:
  [
    {
      "content": "question text",
      "difficulty": "Easy",
      "timeLimit": 20
    },
    ...
  ]`;

  try {
    const response = await generateAIResponse(prompt);
    // Parse JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

export async function evaluateAnswer(question: string, answer: string): Promise<number> {
  const prompt = `Evaluate this interview answer on a scale of 1-10:
  Question: ${question}
  Answer: ${answer}
  
  Consider: relevance, clarity, completeness, and technical accuracy.
  Return only a number between 1 and 10.`;

  try {
    const response = await generateAIResponse(prompt);
    const score = parseInt(response.trim());
    return isNaN(score) ? 5 : Math.max(1, Math.min(10, score));
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return 5;
  }
}

export async function generateSummary(questions: any[], candidateName: string): Promise<string> {
  const questionAnswers = questions.map(q => 
    `Q: ${q.content}\nA: ${q.answer}\nScore: ${q.score}/10`
  ).join('\n\n');

  const prompt = `Generate a professional interview summary for ${candidateName}:

  ${questionAnswers}

  Provide:
  1. Overall performance assessment
  2. Strengths observed
  3. Areas for improvement
  4. Recommendation (Hire/Don't Hire/Consider)

  Keep it concise and professional.`;

  try {
    return await generateAIResponse(prompt);
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Summary generation failed.";
  }
}
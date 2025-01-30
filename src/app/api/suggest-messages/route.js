import { GoogleGenerativeAI } from "@google/generative-ai";
export const runtime = "edge";
export async function GET(request) {


    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        if (!genAI) {
            return Response.json(
                {
                    success: false,
                    error: 'Google API key not found'
                }, { status: 500 })
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const { searchParams } = new URL(request.url);

        const prompt = "Create a list of five open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        // const prompt = searchParams.get("prompt");
        const result = await model.generateContent(prompt);
            // console.log(result.response.text());

            return Response.json(
                {
                    success: true,
                    suggestedMessage: result.response.text()
                }, { status: 200 });

        } catch (error) {
            console.log("error in getting suggested messages: ")
            throw error;
        }
    }
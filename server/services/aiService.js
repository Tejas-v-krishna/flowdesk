const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const generateAIResponse = async (messages, context) => {
    try {
        const systemPrompt = `
      You are FlowDesk AI, a highly efficient personal productivity assistant. 
      You have access to the user's projects and tasks.
      User's Active Projects: ${JSON.stringify(context.projects)}
      User's Tasks: ${JSON.stringify(context.tasks)}
      Today's Date: ${new Date().toDateString()}
      
      Always be concise, professional, and helpful. 
      Focus on helping the user manage their workflow and break down complex tasks.
    `;

        const stream = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620", // or the specified version
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages,
            stream: true,
        });

        return stream;
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
};

module.exports = { generateAIResponse };

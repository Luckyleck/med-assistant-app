export const fetchOpenAIResponse = async (text) => {
    console.log("Sending transcript to OpenAI:", text);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: "Your task is to identify and extract the medical question from the user's message, and display their question. correct any grammar and condense it if possible." },
                { role: 'user', content: text }
            ],
            max_tokens: 50,  // Limit to a shorter response since we're just extracting the question
        }),
    });

    const data = await response.json();
    console.log("Response from OpenAI for question extraction:", data);

    if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else {
        console.error('No valid response from OpenAI:', data);
        return null;
    }
};

// Fetch a suggested answer based on the extracted question and knowledge base text
export const fetchSuggestedAnswer = async (question, knowledgeText) => {
    console.log("Sending question and knowledge base to OpenAI:", question);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `You are a medical assistant. Use the following text as a knowledge base to provide the most suitable answer. If the quesiton is not related to medicine, please give back 'Please ask a question related to medicine', please keep the response less than 3 sentences` },
                { role: 'assistant', content: knowledgeText },
                { role: 'user', content: question }
            ],
            max_tokens: 150,
        }),
    });

    const data = await response.json();
    console.log("Response from OpenAI for suggested answer:", data);

    if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else {
        console.error('No valid response from OpenAI:', data);
        return "No relevant answer found.";
    }
};
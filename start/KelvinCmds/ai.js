const axios = require("axios");

// PrinceTech AI configuration
const PRINCE_API_KEY = "prince_cam";
const PRINCE_BASE = "https://api.princetechn.com/api/ai";

/**
 * Shared helper — calls a PrinceTech AI endpoint and returns the result string.
 * All endpoints return: { status: 200, success: true, creator, result }
 * Except `wwdgpt`, which nests it as result.data.
 */
async function callPrinceAI(endpoint, query) {
    const apiUrl = `${PRINCE_BASE}/${endpoint}?apikey=${PRINCE_API_KEY}&q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl, { timeout: 30000 });
    const data = response.data;

    if (!data || data.success !== true) {
        throw new Error('API returned no response');
    }

    // wwdgpt wraps its answer in result.data — handle both shapes.
    if (data.result && typeof data.result === 'object' && typeof data.result.data === 'string') {
        return data.result.data;
    }

    if (typeof data.result === 'string') {
        return data.result;
    }

    throw new Error('No AI response received');
}

async function veniceAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🤖 *Venice AI*\n\nPlease ask me something!\n\nExample:\n.venice Introduction to JavaScript\n.venice What is quantum computing?"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *Venice AI Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("gpt", query);

        const formattedResponse = `🤖 *Venice AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('Venice AI Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "❌ Error connecting to Venice AI. Please try again."
        }, { quoted: message });
    }
}

async function mistralAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🦅 *Mistral AI*\n\nPlease ask me something!\n\nExample:\n.mistral Explain machine learning\n.mistral Write a poem about nature"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *Mistral AI Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("mistral", query);

        const formattedResponse = `🦅 *Mistral AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('Mistral AI Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "❌ Error connecting to Mistral AI. Please try again."
        }, { quoted: message });
    }
}

async function perplexityAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🔍 *Perplexity AI*\n\nPlease ask me something!\n\nExample:\n.perplexity Latest news about AI\n.perplexity How does photosynthesis work?"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *Perplexity AI Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("letmegpt", query);

        const formattedResponse = `🔍 *Perplexity AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('Perplexity AI Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "❌ Error connecting to Perplexity AI. Please try again."
        }, { quoted: message });
    }
}

async function bardAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🎭 *Google Bard AI*\n\nPlease ask me something!\n\nExample:\n.bard Tell me a joke\n.bard Explain blockchain technology"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *Bard AI Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("gpt4o", query);

        const formattedResponse = `🎭 *Google Bard AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('Bard AI Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "❌ Error connecting to Google Bard AI. Please try again."
        }, { quoted: message });
    }
}

async function gpt4NanoAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🧠 *GPT-4 Nano AI*\n\nPlease ask me something!\n\nExample:\n.gpt4nano Write a short story\n.gpt4nano Solve this math problem: 2x + 5 = 15"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *GPT-4 Nano Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("gpt4o-mini", query);

        const formattedResponse = `🧠 *GPT-4 Nano AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('GPT-4 Nano Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "❌ Error connecting to GPT-4 Nano AI. Please try again."
        }, { quoted: message });
    }
}

async function kelvinAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🤖 *Kelvin AI*\n\nPlease ask me something!\n\nExample:\n.kelvinai Hello, how are you?\n.keithai What can you do?"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *Kelvin AI Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("chat", query);

        const formattedResponse = `🤖 *Kelvin AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('Kelvin AI Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "Error connecting to Kelvin AI. Please try again."
        }, { quoted: message });
    }
}

async function claudeAICommand(conn, chatId, query, message) {
    try {
        if (!query) {
            return await conn.sendMessage(chatId, {
                text: "🤖 *Claude AI*\n\nPlease ask me something!\n\nExample:\n.claude Write an email template\n.claude Explain object-oriented programming"
            }, { quoted: message });
        }

        await conn.sendMessage(chatId, { text: "🤔 *Claude AI Thinking...*" }, { quoted: message });

        const aiResponse = await callPrinceAI("deepseek-v3", query);

        const formattedResponse = `🤖 *Claude AI*\n\n${aiResponse}\n\n_🔍 Query: ${query}_`;
        await conn.sendMessage(chatId, { text: formattedResponse }, { quoted: message });

    } catch (error) {
        console.error('Claude AI Error:', error.message);
        await conn.sendMessage(chatId, {
            text: "❌ Error connecting to Claude AI. Please try again."
        }, { quoted: message });
    }
}

module.exports = {
    veniceAICommand,
    mistralAICommand,
    perplexityAICommand,
    bardAICommand,
    gpt4NanoAICommand,
    kelvinAICommand,
    claudeAICommand
};
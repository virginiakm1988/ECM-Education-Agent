// Vercel Serverless Function for NVIDIA NIM API Proxy
// Save this as: api/chat.js in your Vercel deployment

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { provider, apiKey, nimEndpoint, message, model, temperature } = req.body;

        let response;
        
        if (provider === 'nvidia-nim') {
            response = await callNvidiaNIM(message, apiKey, nimEndpoint, model, temperature);
        } else if (provider === 'gemini') {
            response = await callGemini(message, apiKey, model, temperature);
        } else if (provider === 'openai') {
            response = await callOpenAI(message, apiKey, model, temperature);
        } else if (provider === 'anthropic') {
            response = await callAnthropic(message, apiKey, model, temperature);
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }

        return res.status(200).json({ response });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function callNvidiaNIM(message, apiKey, nimEndpoint, model, temperature) {
    const baseUrl = nimEndpoint || 'https://integrate.api.nvidia.com/v1';
    const url = `${baseUrl}/chat/completions`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: message }],
            temperature: temperature,
            top_p: 0.7,
            max_tokens: 4096,
            stream: false
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `NVIDIA NIM API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGemini(message, apiKey, model, temperature) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
            generationConfig: {
                temperature: temperature,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function callOpenAI(message, apiKey, model, temperature) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: message }],
            temperature: temperature,
            max_tokens: 1024
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callAnthropic(message, apiKey, model, temperature) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: 1024,
            temperature: temperature,
            messages: [{ role: 'user', content: message }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    return data.content[0].text;
}

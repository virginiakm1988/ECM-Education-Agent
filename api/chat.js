// Vercel Serverless Function for EOP/ECM Education Agent
// Handles API calls to various LLM providers including NVIDIA NIM

export default async function handler(req, res) {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            provider, 
            apiKey, 
            nimEndpoint, 
            message, 
            model, 
            temperature 
        } = req.body;

        console.log(`🔍 API Request: Provider=${provider}, Model=${model}`);

        // Validate required fields
        if (!provider || !message) {
            return res.status(400).json({ error: 'Missing required fields: provider, message' });
        }

        if (!apiKey && provider !== 'ollama') {
            return res.status(400).json({ error: 'API key required for this provider' });
        }

        let response;
        
        // Route to appropriate LLM provider
        switch (provider) {
            case 'nvidia-nim':
                response = await callNvidiaNIM(message, apiKey, nimEndpoint, model, temperature);
                break;
            case 'gemini':
                response = await callGemini(message, apiKey, model, temperature);
                break;
            case 'openai':
                response = await callOpenAI(message, apiKey, model, temperature);
                break;
            case 'anthropic':
                response = await callAnthropic(message, apiKey, model, temperature);
                break;
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

        console.log(`✅ API Success: ${provider} - ${response.length} chars`);
        return res.status(200).json({ response });

    } catch (error) {
        console.error('❌ API Error:', error);
        return res.status(500).json({ 
            error: error.message || 'Internal server error' 
        });
    }
}

// NVIDIA NIM API Integration
async function callNvidiaNIM(message, apiKey, nimEndpoint, model, temperature) {
    // Use NVIDIA's integrate API if no custom endpoint provided
    const baseUrl = nimEndpoint && nimEndpoint.trim() !== '' 
        ? nimEndpoint.replace(/\/v1$/, '') 
        : 'https://integrate.api.nvidia.com/v1';
    
    const url = `${baseUrl}/chat/completions`;
    
    console.log(`🔗 NVIDIA NIM Request: ${url}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: 'You are an expert EOP/ECM Education Agent specialized in research software transparency and Evidence Chain Model implementation.' },
                { role: 'user', content: message }
            ],
            temperature: temperature || 0.6,
            top_p: 0.95,
            max_tokens: 4096,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error?.message || errorData.message || 'NVIDIA NIM API error';
        } catch {
            errorMessage = `NVIDIA NIM API error: ${response.status} - ${errorText}`;
        }
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Google Gemini API Integration
async function callGemini(message, apiKey, model, temperature) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: message
                }]
            }],
            generationConfig: {
                temperature: temperature || 0.7,
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

// OpenAI API Integration
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
            temperature: temperature || 0.7,
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

// Anthropic Claude API Integration
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
            temperature: temperature || 0.7,
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

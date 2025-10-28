# AI Chatbot - Multi-LLM Support

A modern, responsive chatbot web application that supports multiple Large Language Model (LLM) providers including Google Gemini, OpenAI GPT, Anthropic Claude, and local Ollama models.

## Features

- 🤖 **Multi-LLM Support**: Works with Gemini, OpenAI, Anthropic, and Ollama
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- ⚙️ **Configurable Settings**: Easy-to-use settings panel for API keys and model selection
- 💬 **Real-time Chat**: Instant messaging with typing indicators
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- 🔒 **Privacy First**: API keys stored locally, never sent to external servers
- 🎛️ **Temperature Control**: Adjustable creativity/randomness for AI responses

## Supported LLM Providers

### Google Gemini
- Gemini Pro
- Gemini Pro Vision

### OpenAI
- GPT-4
- GPT-4 Turbo
- GPT-3.5 Turbo

### Anthropic Claude
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

### NVIDIA NIM (Inference Microservices)
- Llama 3 70B Instruct
- Llama 3 8B Instruct
- Phi-3 Medium 128K
- Phi-3 Mini 128K
- Mixtral 8x7B Instruct
- Mistral 7B Instruct
- Gemma 7B
- CodeGemma 7B

### Ollama (Local)
- Llama 2
- Code Llama
- Mistral
- Any other Ollama-supported model

## Getting Started

### Prerequisites

1. **For cloud providers**: You'll need API keys from your chosen provider(s):
   - **Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Anthropic**: Get your API key from [Anthropic Console](https://console.anthropic.com/)
   - **NVIDIA NIM**: Get your API key from [NVIDIA NGC](https://catalog.ngc.nvidia.com/) and set up your NIM endpoint

2. **For Ollama**: Install [Ollama](https://ollama.ai/) locally and pull your desired models:
   ```bash
   ollama pull llama2
   ollama pull codellama
   ollama pull mistral
   ```

### Installation

1. **Clone or download** this repository to your local machine
2. **Open `index.html`** in your web browser
3. **Click the settings gear** icon in the top right
4. **Configure your settings**:
   - Select your preferred LLM provider
   - Enter your API key (if using cloud providers)
   - Choose your model
   - Adjust temperature (creativity level)
5. **Save settings** and start chatting!

## Usage

1. **Open the application** in your web browser
2. **Configure settings** by clicking the gear icon
3. **Type your message** in the input field at the bottom
4. **Press Enter** or click the send button
5. **Wait for the AI response** (typing indicator will show)

### Settings Panel

- **LLM Provider**: Choose between Gemini, OpenAI, Anthropic, NVIDIA NIM, or Ollama
- **API Key**: Enter your API key (stored locally for security)
- **NIM Endpoint**: Enter your NVIDIA NIM endpoint URL (only for NIM provider)
- **Model**: Select the specific model you want to use
- **Temperature**: Control creativity (0.0 = focused, 1.0 = creative)

### Features

- **Clear Chat**: Remove all messages and start fresh
- **Auto-resize Input**: Text area expands as you type longer messages
- **Status Indicator**: Shows connection status and current activity
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## Security & Privacy

- ✅ **API keys stored locally** in your browser's localStorage
- ✅ **No data sent to our servers** - direct communication with LLM providers
- ✅ **Open source** - you can inspect all code
- ✅ **No tracking or analytics**

## Troubleshooting

### Common Issues

1. **"Please set your API key in settings"**
   - Make sure you've entered a valid API key in the settings panel
   - Verify the API key is correct for your chosen provider

2. **"Please set your NIM endpoint in settings"**
   - Enter your NVIDIA NIM endpoint URL (e.g., `https://your-nim-endpoint.com/v1`)
   - Make sure the endpoint is accessible and properly configured

3. **"Error occurred"**
   - Check your internet connection
   - Verify your API key is valid and has sufficient credits
   - Make sure you've selected a supported model
   - For NIM: Verify your endpoint URL is correct and accessible

4. **Ollama not working**
   - Ensure Ollama is installed and running locally
   - Make sure the model you selected is pulled: `ollama pull <model-name>`
   - Verify Ollama is running on the default port (11434)

5. **CORS errors with Ollama**
   - Start Ollama with CORS enabled: `OLLAMA_ORIGINS=* ollama serve`

6. **NVIDIA NIM connection issues**
   - Verify your NIM endpoint is running and accessible
   - Check that your API key has proper permissions
   - Ensure the model you selected is available on your NIM instance

### API Rate Limits

Different providers have different rate limits:
- **Gemini**: Free tier has generous limits
- **OpenAI**: Depends on your plan and usage
- **Anthropic**: Varies by subscription tier
- **NVIDIA NIM**: Depends on your NGC subscription and endpoint configuration
- **Ollama**: No limits (runs locally)

## Customization

The application is built with vanilla HTML, CSS, and JavaScript, making it easy to customize:

- **Styling**: Modify `styles.css` to change colors, fonts, and layout
- **Functionality**: Edit `script.js` to add new features or providers
- **UI Elements**: Update `index.html` to modify the interface

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this chatbot!

## License

This project is open source and available under the MIT License.

---

**Enjoy chatting with your AI assistant!** 🤖✨
